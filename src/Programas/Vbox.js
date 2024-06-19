import { Vanie , globalVanie } from 'vanie';
import Aplicacion from '../Sistema/Aplicacion'
import { _div, elegirNodo, imagen, link, moldeBipanel, moldeElemento, parrafo, txt } from '../Data/moldes'
import { icoOs , ico, url} from '../Data/iconos';
import kernel from '../Sistema/Kernel';

const icoVB = {
    herramientas:"./recursos/iconos/herramientas.png",
    off:"./recursos/iconos/apagador.png",
    flecha:"./recursos/iconos/flechita.png",
    claro:"./recursos/iconos/claro.png",
    oscuro:"./recursos/iconos/oscuro.png",
}

export default class Vbox{
    #app= new Aplicacion(Vbox.comando,'Virtual box',this.ico,this);
    #ventana = new Vanie;
    #panelIzq; #panelDer; #listaIzq = ['Herramientas','mac','windows','linux']; #idxSys = 0;#idxSysSel = 0;

    static get comando(){return 'VBoxManage';}
    get ico(){return './recursos/iconos/vitual box.png';}

    constructor(){
        this.#ventana.cambiarDimensionDelLienzo(775,510);
        this.#ventana.cambiarDimensionMinima(500,300);
        this.#construir();
    }

    #construir(){
        const [contenedor,izquierdo,derecho] = moldeBipanel();
        contenedor.classList.add('vb-contenedor');
        this.#construirPanelIzquierdo(izquierdo);
        this.#construirPanelDerecho(derecho);
        this.#idxSys = this.#listaIzq.indexOf(kernel.os);
        this.#seleccionarCelda(this.#idxSys);
        this.#correrOs(this.#idxSys,true);

        izquierdo.addEventListener('click',e=>{
            this.#desmarcarCelda();
            elegirNodo(e,izquierdo,(idx)=>{
                this.#seleccionarCelda(idx);})});

        izquierdo.addEventListener('dblclick',e=>{
            elegirNodo(e,izquierdo,(idx)=>{
                this.#correrOs(this.#idxSys,false);
                this.#idxSys = idx;
                this.#correrOs(idx,true)})})

        this.#ventana.lienzo = contenedor;}

    #modTranslacion(transladar){
        const [sup,inf] = this.#panelDer.childNodes[1].childNodes;
        inf.style.transform = sup.style.transform = transladar?'translateY(100%)':'';}

    #construirPanelIzquierdo(dom){
        this.#panelIzq = dom;
        for(let i = 0; i < 4; ++i){
            const [divcon,divico,divtxt] = moldeBipanel(false);
            divcon.classList.add('vb-sel');
            divico.classList.add(globalVanie.globalClass('bloqueado'));
            divtxt.classList.add(globalVanie.globalClass('bloqueado'));
            let ic = icoOs[this.#listaIzq[i]];
            if(!ic) ic = icoVB.herramientas;
            divico.appendChild(imagen(ic));
            divtxt.appendChild(txt(this.#listaIzq[i]));
            if(i){
                const sub = moldeElemento(icoVB.off,'Apagada')
                sub.classList.add('vb-sel-sub');
                divtxt.appendChild(sub);}
            this.#panelIzq.appendChild(divcon);}}

    #correrOs(indice,onoff){
        if(!indice) return;
        const selecion =  this.#panelIzq.childNodes[indice];
        const [img , span] = selecion.childNodes[1].childNodes[1].firstChild.childNodes;
        img.setAttribute('src',onoff ? icoVB.flecha : icoVB.off );
        span.innerText = onoff ? 'Corriendo' : 'Apagada';}
    

    #seleccionarCelda(indice){
        this.#idxSysSel = indice;
        const selecion =  this.#panelIzq.childNodes[indice];
        this.#modTranslacion(!indice);
        selecion.style.backgroundColor = '#8fceff';}

    
    #desmarcarCelda(){
        for(const div of this.#panelIzq.childNodes)
            div.style.backgroundColor = '';}

    #construirPanelDerecho(dom){
        this.#panelDer = dom;
        this.#construirBarraHerramientas();
        const [contenedor,sup,inf] = moldeBipanel(false);
        this.#panelDerechoSup(sup);
        this.#panelDerechoInf(inf);
        this.#panelDer.classList.add('vb-der');
        this.#panelDer.appendChild(contenedor);}

    #construirBarraHerramientas(){
            const contenedor = _div(_div(imagen(icoVB.flecha,true),txt('iniciar',true)),_div(imagen(icoVB[kernel.inversoTema],true),txt(kernel.inversoTema,true)),link(url.github,imagen(ico.github)))
            this.#panelDer.appendChild(contenedor);

            contenedor.addEventListener('click',e=>{
                elegirNodo(e,contenedor,(idx)=>{
                    switch(idx){
                        case 0:
                            if(this.#idxSys == this.#idxSysSel || !this.#idxSysSel) return;
                            this.#correrOs(this.#idxSys);
                            this.#correrOs(this.#idxSysSel,true);
                            this.#idxSys = this.#idxSysSel;
                            break;
                        case 1:
                            kernel.interruptorTema();
                            contenedor.childNodes[1].childNodes[0].src = icoVB[kernel.inversoTema];
                            contenedor.childNodes[1].childNodes[1].innerText = kernel.inversoTema;
                            break;}});});}
                            
    #panelDerechoSup(sup){
        sup.classList.add('vb-der-sup',globalVanie.globalClass('animacion'));
        sup.appendChild(_div(txt('Bienvenido a mi portafolio.'),
            parrafo('Este portafolio web está inspirado en la estética de los tres sistemas operativos más utilizados: Windows, Linux y Mac. Fue construido utilizando HTML, CSS y JavaScript, sin recurrir a ningún framework.'),
            parrafo('Las únicas librerías empleadas fueron Vanie y Nauty, ambas creadas por mí y disponibles en npm. Vanie es una librería destinada a la creación y gestión de ventanas arrastrables (draggables), mientras que Nauty se encarga del manejo de coordenadas y transformaciones en un plano 2D.')));
        sup.appendChild(imagen('https://i.ibb.co/gyFR3Xr/estrlla-rota-ld-2.jpg'));
        const vanie_a = link(url.vanie,imagen('https://i.ibb.co/r2RFbVP/perfil-vanie-1.png'));
        const nauty_a = link(url.nauty,imagen('https://i.ibb.co/NT0X9Yr/perfil-nauty.png'));
        sup.appendChild(_div(txt('Construido con:'),imagen(ico.html),imagen(ico.css),imagen(ico.js),vanie_a,nauty_a));}

    #panelDerechoInf(inf){
        inf.classList.add('vb-der-inf',globalVanie.globalClass('animacion'));
        inf.appendChild(txt(this.#obtenerNavegador()));
        inf.appendChild(txt(this.#obtenerOS()));
        

    }

    #obtenerNavegador(){
        const userAgent = navigator.userAgent;
        const navegadores = {
            Firefox:'Mozilla Firefox',
            Opera:'Opera',OPR:'Opera',
            Chrome:'Google Chrome',
            Safari:'Apple Safari',
            Trident:'Microsoft Interner Explorer',
            Edg:'Microsoft Edge'};

        let navegador = '';
        const nav = [];
        let validos = 0;
        console.log(userAgent);

        for(const llave in navegadores){
            if(userAgent.indexOf(llave) > -1){
                ++validos;
                if(llave == 'Chrome' || llave == 'Safari') nav.push(llave);
                navegador = navegadores[nav.length != validos? llave:nav[0]];}}
        return navegador;}

    #obtenerOS(){
        const plataforma = navigator.userAgent;
        let os = '';
        for(const sis of kernel.sistemas){
            const sistema = sis.charAt(0).toUpperCase() + sis.slice(1);
            if(plataforma.indexOf(sistema)){
                os = sistema;
                break;}}
        return os;}

    abrir(){
        if(!this.#app.ventanaUnica)
            this.#app.agregarVentanaUnica(this.#ventana,'Oracle VM virtualBox Administrador');
        this.#ventana.abrir();}
}