import { globalVanie } from "vanie";
import Lanzador from "../Sistema/Lanzador"
import kernel from "../Sistema/Kernel";
import { elegirNodo, moldeElemento } from "../Data/moldes";

export default class Menu{
    #lanzador;
    #estaCargado = false;
    #divApp;
    #divVar;
    #divBuscador;

    static get ico(){return {mac:'./recursos/iconos_mac/launchpad.png'}[kernel.os];}
    static get nombre(){return {mac:'Launchpad',windows:'Inicio',linux:'Mostrar Aplicaciones'}[kernel.os];}

    constructor(){
        this.#lanzador = new Lanzador(Menu.nombre,Menu.ico,true);
        this.#lanzador.apertura();
        this.divMenu = undefined;

        this.visible = false;

        //registro funciones
        this.interruptor = this.interruptor.bind(this);
        this.mostrar = this.mostrar.bind(this);
        this.ocultar = this.ocultar.bind(this);

        this.#cargar();
        this.#estrurador();
        this.#lanzador.addEventListener('click',this.interruptor);
        kernel.menu = this;}

    #cargar(){
        this.#construir();

        this.divMenu.addEventListener('click',this.ocultar);

        this.divMenu.addEventListener('transitionend',()=>{
            this.#opacidadVentanas(undefined,'remove');
            if(!this.visible){
                this.divMenu.style.display = 'none';}});}

    #construir(){
        this.#divApp = document.createElement('div');
        this.#divVar = document.createElement('div');
        this.#divBuscador = document.createElement('div');
        this.divMenu = document.createElement('div');
        this.divMenu.style.opacity = 0;
        if(kernel.esMac) this.divMenu.style.transform = 'scale(1.2)';

        this.divMenu.classList.add(globalVanie.globalClass('animacion'));
        globalVanie.padre.appendChild(this.divMenu);
        this.divMenu.style.display = 'none';}

    #opacidadVentanas(n,accion){
        if(!kernel.esWindows)
            globalVanie.ventanasForEach(vanie =>{
                if(vanie.esVisible){
                    vanie.ventana.classList[accion](globalVanie.globalClass('animacion'));
                    if(n != undefined)vanie.opacidad = n}});}

    mostrar(){
        if(this.esVisible) return;
        this.visible = true;
        
        this.divMenu.style.display = '';
        this.#opacidadVentanas(0,'add');
        
        this.divMenu.style.zIndex = globalVanie.ventanasVisibles + 1;
        kernel.DOCK.zIndex = globalVanie.ventanasVisibles + 2;

        if(!this.#estaCargado){
            this.#estaCargado = true;
            const ruta = kernel.ruta.copia;
            ruta.cd('Aplicaciones'); // ir a la ruta Aplicaciones

            ruta.forEach((contenido)=>{
                const app = kernel.aplicacion(contenido.data[0]);

                const acesoDirecto = moldeElemento(app.ico,app.nombre??contenido.nombre);
                acesoDirecto.classList.add('folder');
                this.#divApp.appendChild(acesoDirecto);
            });
            this.#divApp.addEventListener('click',e=>{
                elegirNodo(e,this.#divApp,(i)=>{
                    setTimeout(()=>{ruta.cd(i)},10); }); });}
        
        setTimeout(()=>{
            if(kernel.esMac) this.divMenu.style.transform = '';
            this.divMenu.style.opacity = 1;},10);}


    ocultar(){
        if(!this.esVisible) return;
        this.visible = false;
        if(kernel.esMac) this.divMenu.style.transform = 'scale(1.2)';

        this.#opacidadVentanas(1,'remove');
        this.divMenu.style.opacity = 0;
        this.divMenu.style.zIndex = -1;}

    interruptor(e){
        if(this.esVisible) this.ocultar();
        else this.mostrar();
        kernel.ocultarTodasLasMiniaturas();
        kernel.DOCK.activar(e);}

    actualizar(){
        this.divMenu.style.transform = '';
        if(!this.esVisible && kernel.esMac)
            this.divMenu.style.transform = 'scale(1.2)';
        
        while(this.divMenu.firstChild){this.divMenu.removeChild(this.divMenu.firstChild);}
        this.#estrurador();}

    #estrurador(){
        this.divMenu.appendChild(this.#divBuscador);
        this.divMenu.appendChild(this.#divApp);

        switch (kernel.os){
            case 'mac':
                this.divMenu.classList.add('acrilico','launchpad');
                break;
            case 'linux':
                this.divMenu.insertBefore(this.#divApp,this.#divVar);
                break;
            default:
                this.divMenu.appendChild(this.#divVar);}}

    get esVisible(){return this.visible;}}