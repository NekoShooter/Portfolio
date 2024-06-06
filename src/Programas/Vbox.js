import { Vanie , globalVanie } from 'vanie';
import Aplicacion from '../Sistema/Aplicacion'
import { _div, elegirNodo, imagen, link, moldeBipanel, moldeElemento, parrafo, txt } from '../Data/moldes'
import { icoOs , ico, url} from '../Data/iconos';
import kernel from '../Sistema/Kernel';

const icoVB = {
    herramientas:"https://cdn.icon-icons.com/icons2/945/PNG/512/Office_-26_icon-icons.com_74013.png",
    off:"https://cdn.icon-icons.com/icons2/37/PNG/512/off_theapplication_3027.png",
    flecha:"https://cdn.icon-icons.com/icons2/10/PNG/256/Next_arrow_1559.png",
}

export default class Vbox{
    #app= new Aplicacion(Vbox.comando,'Virtual box',this.ico,this);
    #ventana = new Vanie;
    #panelIzq; #panelDer; #listaIzq = ['Herramientas','mac','windows','linux']; #sys;

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
        const idx = this.#listaIzq.indexOf(kernel.os);
        this.#seleccionarCelda(idx);
        this.#cambiarEstadoOs(idx,true);
        izquierdo.addEventListener('click',e=>{
            this.#desmarcarCelda();
            elegirNodo(e,izquierdo,(idx)=>{
                this.#seleccionarCelda(idx);})
        });
        this.#ventana.lienzo = contenedor;}

    #modTranslacion(transladar){
        const [sup,inf] = this.#panelDer.childNodes[1].childNodes;
        inf.style.transform = sup.style.transform = transladar?'translateY(100%)':'';
    }

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

    #cambiarEstadoOs(indice,encedido){
        if(indice){
            const selecion =  this.#panelIzq.childNodes[indice];
            const [img , span] = selecion.childNodes[1].childNodes[1].firstChild.childNodes;
            img.setAttribute('src',encedido ? icoVB.flecha : icoVB.off );
            span.innerText = encedido ? 'Corriendo' : 'Apagada';}}

    #seleccionarCelda(indice){
        const selecion =  this.#panelIzq.childNodes[indice];
        this.#modTranslacion(!indice);
        selecion.style.backgroundColor = '#8fceff';}

    
    #desmarcarCelda(){
        for(const div of this.#panelIzq.childNodes)
            div.style.backgroundColor = '';}

    #construirPanelDerecho(dom){
        this.#panelDer = dom;
        const div = document.createElement('div')
        this.#panelDer.appendChild(div);
        const  [contenedor,sup,inf] = moldeBipanel(false);
        sup.classList.add('vb-der-sup',globalVanie.globalClass('animacion'));
        inf.classList.add('vb-der-inf',globalVanie.globalClass('animacion'));
        this.#panelDer.classList.add('vb-der');
        this.#panelDer.appendChild(contenedor);        
        sup.appendChild(_div(txt('Bienvenido a mi portafolio.'),
            parrafo('Este portafolio web está inspirado en la estética de los tres sistemas operativos más utilizados: Windows, Linux y Mac. Fue construido utilizando HTML, CSS y JavaScript, sin recurrir a ningún framework.'),
            parrafo('Las únicas librerías empleadas fueron Vanie y Nauty, ambas creadas por mí y disponibles en npm. Vanie es una librería destinada a la creación y gestión de ventanas arrastrables (draggables), mientras que Nauty se encarga del manejo de coordenadas y transformaciones en un plano 2D.')));
        sup.appendChild(imagen('https://i.ibb.co/gyFR3Xr/estrlla-rota-ld-2.jpg'));
        const vanie_a = link(url.vanie);
        vanie_a.appendChild(imagen('https://i.ibb.co/r2RFbVP/perfil-vanie-1.png'));
        const nauty_a = link(url.nauty);
        nauty_a.appendChild(imagen('https://i.ibb.co/NT0X9Yr/perfil-nauty.png'));
        sup.appendChild(_div(txt('Construido con:'),imagen(ico.html),imagen(ico.css),imagen(ico.js),vanie_a,nauty_a));}

    abrir(){
        if(!this.#app.ventanaUnica)
            this.#app.agregarVentanaUnica(this.#ventana,'Oracle VM virtualBox Administrador');
        this.#ventana.abrir();}
}