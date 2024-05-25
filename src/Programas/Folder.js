import {Vanie , globalVanie } from "vanie";
import Aplicacion from "../Sistema/Aplicacion";
import kernel from "../Sistema/Kernel";
import { ICONOS , ico, icon } from "../Data/iconos";
import { color , invertirTema } from '../Data/color'
import { moldeArchivo, moldeElemento , elegirNodo, moldeBipanel} from "../Data/moldes";
import { ESTADO } from "../Sistema/PWD";

export default class Folder{
    #folder = new Aplicacion('home','home',ICONOS[kernel.os].home.ico,true);
    #ventana = new Vanie;
    #pwd;
    constructor(){
        kernel.registrarApp('home',ICONOS[kernel.os].home.nombre,this);
        this.#folder.agregarVentanaUnica(this.#ventana,ICONOS[kernel.os].home.nombre);
        this.#ventana.cambiarDimensionInicial(750,500);
        this.#ventana.cambiarDimensionMinima(320,350);

        this.#ventana.addEventListener('abrir',()=>{
            this.#ventana.lienzo.style.display = 'flex';
            this.#construir();});}

    abrir(){this.#ventana.abrir();};

    #construir(){
        this.#pwd = kernel.pwd.copia;
        const [contenedor,panel_derecho,carpetas] = moldeBipanel();
        
        const fondoDer = document.createElement('div');
        fondoDer.classList.add('acrilicoBlack','fondo',globalVanie.globalClass('bloqueado'));
        contenedor.classList.add('contenedor-folder');

        panel_derecho.appendChild(fondoDer);
        panel_derecho.classList.add(`panel-${kernel.os}`);

        const llaves = {Inicio:'home',Aplicaciones:'app',Codigo:'proyecto',Videos:'video'}

        for(const dir of [this.#pwd.origen,...this.#pwd.rutas]){
            const div = moldeElemento(ICONOS[kernel.os][llaves[dir]].ico2,dir)
            panel_derecho.appendChild(div);
            if(!kernel.esWindows && kernel.tema == 'oscuro')
                div.firstChild.firstChild.style.filter = 'invert(100%)';}

        this.#agregarContenido(-1,carpetas);
        
        const menu = (idx)=>{
            const bloqueado = globalVanie.globalClass('bloqueado');
            const nodos = panel_derecho.childNodes;
            for(let i = 1;i < nodos.length; ++i){
                const div = nodos[i];
                if(idx == i-1){
                    div.classList.add(bloqueado);
                    div.style.backgroundColor = color[kernel.os].seleccion[kernel.tema];}
                else {
                    div.classList.remove(bloqueado);
                    div.style = '';}}}
        menu(0);
        panel_derecho.addEventListener('click',e=>{
            elegirNodo(e,panel_derecho,(i)=>{
                this.#pwd.borrarHistorial();
                menu(i-1);
                this.#agregarContenido(i-2,carpetas)});});

        carpetas.addEventListener('click',e=>{
            for(const div of carpetas.childNodes) div.style = '';
            elegirNodo(e,carpetas,(i,div)=>{
                div.style.backgroundColor = color[kernel.os].seleccion[invertirTema[kernel.tema]];})});

        carpetas.addEventListener('dblclick',e=>{
            elegirNodo(e,carpetas,i=>{
                if(this.#pwd.rutaActual.tipo == 1) menu(i+1);
                this.#agregarContenido(i,carpetas)});});

        this.#ventana.lienzo.appendChild(contenedor);}
    
    #agregarContenido(n,nodo){

        let estado = ESTADO.ok;
        if(n > -1) {estado = this.#pwd.ir(n);}
        let pwd = this.#pwd.rutaActual;

        if(estado == ESTADO.abierto) return;

        const contenido = nodo??this.#ventana.lienzo.firstChild.childNodes[1];

        if(estado & (ESTADO.ok | ESTADO.vacio))
            while(contenido.firstChild){contenido.removeChild(contenido.firstChild)}

        if(estado == ESTADO.ok){
            pwd.rutas?.forEach(ruta=>{
                const carpetas = moldeElemento(ICONOS[kernel.os].folder.ico,ruta);
                carpetas.classList.add('folder');
                contenido.appendChild(carpetas);});

            if(pwd.origen != 'Aplicaciones'){
                pwd.archivos?.forEach(str=>{
                    const ext = str.split('.')[1];
                    const archivo = moldeArchivo(ICONOS[kernel.os].archivo.ico,ico[ext],str);
                    archivo.classList.add('archivo');
                    contenido.appendChild(archivo);});}
            else{
                pwd.claves?.forEach(clave=>{
                    const archivo = moldeElemento(icon(pwd.obtenerEjecutable(clave)),pwd.obtenerNombreArchivo(clave));
                    archivo.classList.add('folder');
                    contenido.appendChild(archivo);});}}
    }

    actualizar(){
        kernel.registrarApp('home',ICONOS[kernel.os].home.nombre,this);
        this.#folder.lanzador.cambiarIco(ICONOS[kernel.os].home.ico);
        this.#ventana.titulo = ICONOS[kernel.os].home.nombre;
    }
}