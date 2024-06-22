import {Vanie , globalVanie } from "vanie";
import Aplicacion from "../Sistema/Aplicacion";
import kernel from "../Sistema/Kernel";
import { ICONOS , ico, icon } from "../Data/iconos";
import { moldeArchivo, moldeElemento , elegirNodo, moldeBipanel} from "../Data/moldes";
import { ESTADO } from "../Sistema/Ruta";

const colorSeleccion = {
    mac:{
        oscuro:'rgba(11, 11, 11, 0.4)',
        claro:'rgba(245, 245, 245, 0.4)'
    }
}

export default class Folder{
    #folder = new Aplicacion(Folder.comando,'home',this.ico,this,true);
    #contenido = undefined;
    #idx_contenido = undefined;
    #idx_panelDer = undefined;
    #panel_derecho = undefined;
    #ventana = new Vanie;
    #ruta;

    static get comando(){return 'home';}
    get nombre(){return {mac:'Finder',windows:'Este Equipo',linux:'Carpeta Personal'}[kernel.os];}
    get ico(){return {mac:'./recursos/iconos_mac/finder.png'}[kernel.os];}

    constructor(){
        this.#folder.agregarVentanaUnica(this.#ventana,this.nombre);
        this.#ventana.cambiarDimensionInicial(750,500);
        this.#ventana.cambiarDimensionMinima(320,350);

        this.#ventana.addEventListener('abrir',()=>{
            this.#ventana.lienzo.style.display = 'flex';
            this.#construir();});}

    abrir(){this.#ventana.abrir();};

    #construir(){
        this.#ruta = kernel.ruta.copia;
        const [contenedor,panel_derecho,carpetas] = moldeBipanel();
        this.#contenido = carpetas;
        this.#panel_derecho = panel_derecho;
        
        const fondoDer = document.createElement('div');
        fondoDer.classList.add('acrilico','fondo',globalVanie.globalClass('bloqueado'));
        contenedor.classList.add('contenedor-folder');

        panel_derecho.appendChild(fondoDer);
        panel_derecho.classList.add(`panel-${kernel.os}`);

        const selector = (nombre,alias)=>{
            const div = moldeElemento(icon(alias),nombre);
            panel_derecho.appendChild(div);
            if(!kernel.esWindows)
                div.firstChild.firstChild.style.filter = 'invert(100%)';}

        selector(this.#ruta.direccionOrigen,this.#ruta.alias);
        this.#ruta.forEach((contenido)=>{ selector(contenido.nombre,contenido.data.alias);})

        this.#agregarContenido(-1,carpetas);
        this.#menu(0);
        panel_derecho.addEventListener('click',e=>{
            elegirNodo(e,panel_derecho,(i)=>{
                this.#ruta.borrarHistorial();
                this.#menu(i-1);
                this.#agregarContenido(i-2,carpetas)});});

        carpetas.addEventListener('click',e=>{
            for(const div of carpetas.childNodes) div.style = '';
            elegirNodo(e,carpetas,i=>this.#seleccionarContenido(i))});

        carpetas.addEventListener('dblclick',e=>{
            elegirNodo(e,carpetas,i=>{
                if(this.#ruta.rutaActual === this.#ruta.raiz) this.#menu(i+1);
                this.#agregarContenido(i,carpetas)});});

        this.#ventana.lienzo.appendChild(contenedor);}

    #menu(idx){
        if(!this.#panel_derecho) return;
        const bloqueado = globalVanie.globalClass('bloqueado');
        const nodos = this.#panel_derecho.childNodes;
        for(let i = 1;i < nodos.length; ++i){
            const div = nodos[i];
            if(idx == i-1){
                this.#idx_panelDer = idx;
                div.classList.add(bloqueado);
                div.style.backgroundColor = colorSeleccion[kernel.os][kernel.inversoTema];}
            else {
                div.classList.remove(bloqueado);
                div.style = '';}}}

    #seleccionarContenido(indice){
        if(!this.#contenido) return;
        this.#idx_contenido = indice;
        const div = this.#contenido.childNodes[indice];
        if(div) div.style.backgroundColor = colorSeleccion[kernel.os][kernel.inversoTema];}
    
    #agregarContenido(n,nodo){

        let estado = ESTADO.ok;
        if(n > -1) {estado = this.#ruta.cd(n);}

        if(estado == ESTADO.abierto) return;

        const contenido = nodo??this.#ventana.lienzo.firstChild.childNodes[1];

        if(estado & (ESTADO.ok | ESTADO.vacio))
            while(contenido.firstChild){contenido.removeChild(contenido.firstChild)}

        if(estado == ESTADO.ok){
            this.#ruta.forEach((elemento,tipo)=>{
                if(tipo == 1){
                    const carpetas = moldeElemento(ICONOS[kernel.os].folder.ico,elemento.nombre);
                    carpetas.classList.add('folder');
                    contenido.appendChild(carpetas);}
                
                else if (elemento.data[1]){
                    const ext = elemento.nombre.split('.')[1];
                    const archivo = moldeArchivo(ICONOS[kernel.os].archivo.ico,ico[ext],elemento.nombre);
                    archivo.classList.add('archivo');
                    contenido.appendChild(archivo);}
                else{
                    const app = kernel.aplicacion(elemento.data[0]);
                    const archivo = moldeElemento(app.ico,elemento.nombre);
                    archivo.classList.add('folder');
                contenido.appendChild(archivo);}
            });}}

    actualizar(){
        kernel.registrarApp(Folder.comando,this.nombre,this);
        this.#folder.lanzador.cambiarIco(this.ico);
        this.#ventana.titulo = this.nombre;}

    cambiarTema(){
        this.#menu(this.#idx_panelDer);
        this.#seleccionarContenido(this.#idx_contenido);}
}