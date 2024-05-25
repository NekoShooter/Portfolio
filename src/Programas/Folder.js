import {Vanie , globalVanie } from "vanie";
import Aplicacion from "../Sistema/Aplicacion";
import kernel from "../Sistema/Kernel";
import { ICONOS , ico } from "../Data/iconos";
import { color , invertirTema } from '../Data/color'
import { moldeArchivo, moldeElemento , elegirNodo, moldeBipanel} from "../Data/moldes";
import { ESTADO } from "../Sistema/PWD";

export default class Folder{
    #folder = new Aplicacion('home','home',ICONOS[kernel.os].home.ico,true);
    #ventana = new Vanie;
    #pwd= kernel.pwd;
    #cd;
    constructor(){
        kernel.registrarApp('home',ICONOS[kernel.os].home.nombre,this);
        this.#folder.agregarVentanaUnica(this.#ventana,ICONOS[kernel.os].home.nombre);
        this.#ventana.cambiarDimensionInicial(750,500);
        this.#ventana.cambiarDimensionMinima(320,350);

        this.#ventana.addEventListener('abrir',()=>{
            this.#ventana.lienzo.style.display = 'flex';
            this.#construir();});}

    get cd(){return this.#cd??0;}
    get abrir(){this.#ventana.abrir();};

    #construir(){
        this.#cd = undefined;
        const [contenedor,panel_derecho,carpetas] = moldeBipanel();
        this.#pwd.borrarHistorial();
        
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
                if(i!=this.#cd) menu(i+1);
                this.#agregarContenido(i,carpetas)});
            /*
            if(!this.#cd) elegirNodo(e,carpetas,i=>{
                if(i + 1!=this.#cd) menu(i+1);
                this.#agregarContenido(i+1,carpetas)});
            else if(this.#cd == 2){
                const vs = kernel.aplicacion('vsCode');
                if(!vs) return;
                elegirNodo(e,carpetas,i=>{
                    vs.abrir(vsLlave[i]);
                });

            }*/
        });

        this.#ventana.lienzo.appendChild(contenedor);}
    
    #agregarContenido(n,nodo){
        //if(n == this.#cd) return;

        let estado = ESTADO.ok;
        if(n > -1) {estado = this.#pwd.ir(n);}
        let pwd = this.#pwd.rutaActual;

        if(estado == ESTADO.abierto) return;
        //this.#cd = n;

        const contenido = nodo??this.#ventana.lienzo.firstChild.childNodes[1];
        while(contenido.firstChild){contenido.removeChild(contenido.firstChild)}

        if(estado == ESTADO.ok){
            pwd.rutas?.forEach(ruta=>{
                const carpetas = moldeElemento(ICONOS[kernel.os].folder.ico,ruta);
                carpetas.classList.add('folder');
                contenido.appendChild(carpetas);});

            pwd.archivos?.forEach(str=>{
                const ext = str.split('.')[1];
                const archivo = moldeArchivo(ICONOS[kernel.os].archivo.ico,ico[ext],str);
                archivo.classList.add('archivo');
                contenido.appendChild(archivo);});}
        /*
        if(!this.#cd){
            this.#contenido.Inicio.forEach((str)=>{
                const carpetas = moldeElemento(ICONOS[kernel.os].folder.ico,str);
                carpetas.classList.add('folder');
                contenido.appendChild(carpetas);});}

        else if(this.#cd == 2){
            this.#contenido.Codigo.forEach((str)=>{
                const ext = str.split('.')[1];
                const archivo = moldeArchivo(ICONOS[kernel.os].archivo.ico,ico[ext],str);
                archivo.classList.add('archivo');
                contenido.appendChild(archivo);
            });}
        */
    
    }

    actualizar(){
        this.#folder.lanzador.cambiarIco(ICONOS[kernel.os].home.ico);
        this.#ventana.titulo = ICONOS[kernel.os].home.nombre;
    }
}