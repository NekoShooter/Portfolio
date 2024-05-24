import {Vanie , globalVanie } from "vanie";
import Aplicacion from "../Sistema/Aplicacion";
import kernel from "../Sistema/Kernel";
import { ICONOS , ico } from "../Data/iconos";
import { color , invertirTema } from '../Data/color'
import { vsArchivos, vsLlave } from "./vsCode";
import { moldeArchivo, moldeElemento , elegirNodo, moldeBipanel} from "../Data/moldes";

export default class Folder{
    #folder = new Aplicacion('home',ICONOS[kernel.os].home.ico,true);
    #ventana = new Vanie;
    #contenido;
    #pwd;
    constructor(){
        kernel.registrarApp('Folder',this);
        this.#folder.agregarVentanaUnica(this.#ventana,ICONOS[kernel.os].home.nombre);
        this.#ventana.cambiarDimensionInicial(750,500);
        this.#ventana.cambiarDimensionMinima(320,350);
        
        this.#contenido = {
            Inicio:[...this.direcciones.splice(1)],
            Aplicaciones:[],
            Codigo:vsArchivos}

        this.#ventana.addEventListener('abrir',()=>{
            this.#ventana.lienzo.style.display = 'flex';
            this.#construir();});}

    get direcciones (){return ['Inicio','Aplicaciones','Codigo','Videos'];}
    get pwd(){return this.#pwd??0;}

    #construir(){
        this.#pwd = undefined;
        const [contenedor,panel_derecho,carpetas] = moldeBipanel();
        
        const fondoDer = document.createElement('div');
        fondoDer.classList.add('acrilicoBlack','fondo',globalVanie.globalClass('bloqueado'));
        contenedor.classList.add('contenedor-folder');

        panel_derecho.appendChild(fondoDer);
        panel_derecho.classList.add(`panel-${kernel.os}`);

        const llaves = {Inicio:'home',Aplicaciones:'app',Codigo:'proyecto',Videos:'video'}

        
        for(const dir of this.direcciones){
            const div = moldeElemento(ICONOS[kernel.os][llaves[dir]].ico2,dir)
            panel_derecho.appendChild(div);
            if(!kernel.esWindows && kernel.tema == 'oscuro')
                div.firstChild.firstChild.style.filter = 'invert(100%)';}

        this.#agregarContenido(0,carpetas);
        
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
                menu(i-1);
                this.#agregarContenido(i-1,carpetas)});});

        carpetas.addEventListener('click',e=>{
            for(const div of carpetas.childNodes) div.style = '';
            elegirNodo(e,carpetas,(i,div)=>{
                div.style.backgroundColor = color[kernel.os].seleccion[invertirTema[kernel.tema]];})});

        carpetas.addEventListener('dblclick',e=>{
            if(!this.#pwd) elegirNodo(e,carpetas,i=>{
                if(i + 1!=this.#pwd) menu(i+1);
                this.#agregarContenido(i+1,carpetas)});
            else if(this.#pwd == 2){
                const vs = kernel.aplicacion('vsCode');
                if(!vs) return;
                elegirNodo(e,carpetas,i=>{
                    vs.abrir(vsLlave[i]);
                });

            }
        });

        this.#ventana.lienzo.appendChild(contenedor);}
    
    #agregarContenido(n,nodo){
        if(n == this.#pwd) return;
        this.#pwd = n;
        const contenido = nodo??this.#ventana.lienzo.firstChild.childNodes[1];
        while(contenido.firstChild){contenido.removeChild(contenido.firstChild)}
        if(!this.#pwd){
            this.#contenido.Inicio.forEach((str)=>{
                const carpetas = moldeElemento(ICONOS[kernel.os].folder.ico,str);
                carpetas.classList.add('folder');
                contenido.appendChild(carpetas);});}

        else if(this.#pwd == 2){
            this.#contenido.Codigo.forEach((str)=>{
                const ext = str.split('.')[1];
                const archivo = moldeArchivo(ICONOS[kernel.os].archivo.ico,ico[ext],str);
                archivo.classList.add('archivo');
                contenido.appendChild(archivo);
            });


        }}

    actualizar(){
        this.#folder.lanzador.cambiarIco(ICONOS[kernel.os].home.ico);
        this.#ventana.titulo = ICONOS[kernel.os].home.nombre;
    }
}