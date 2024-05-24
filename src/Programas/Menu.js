import { globalVanie } from "vanie";
import ICONOS from "../Data/iconos";
import Lanzador from "../Sistema/Lanzador"
import kernel from "../Sistema/Kernel";

export default class Menu{
    #lanzador; #app;
    constructor(){
        this.icono = ICONOS[kernel.os];
        this.#lanzador = new Lanzador(this.icono.menu.nombre,this.icono.menu.ico,true);
        this.#lanzador.apertura();
        this.divMenu = undefined;
        //this.listaApps = [];
        this.visible = false;
        this.estructura = new Map;
        this.estructura.set('app_contenedor',document.createElement('div'));
        this.estructura.set('var_contenedor',document.createElement('div'));
        this.estructura.set('buscador',document.createElement('div'));
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
            this.divMenu.classList.remove(globalVanie.globalClass('animacion'));
            if(!this.visible)
                this.divMenu.style.display = 'none';});}

    #construir(){
        this.divMenu = document.createElement('div');
        this.divMenu.style.position = 'absolute';
        
        this.#posicionMenu(0,0);

        if(!kernel.esWindows){
            this.#dimencionMenu('100%','100%');
            const div = document.createElement('div');
            this.divMenu.appendChild(div)}
        else this.#dimencionMenu(550,1200);

        if(kernel.esMac)
            this.divMenu.classList.add('acrilico');
        else this.divMenu.backgroundColor = 'rgb(34, 34, 34)';
        globalVanie.padre.appendChild(this.divMenu);
        this.divMenu.style.display = 'none';}


    #dimencionMenu(w = undefined,h = undefined){
        this.divMenu.style.width = typeof(w) == 'number'? `${w}px`: w;
        this.divMenu.style.height =typeof(h) == 'number'? `${h}px`: h;}

    #posicionMenu(x = undefined,y = undefined){
        this.divMenu.style.top = typeof(x) == 'number'? `${x}px`: x;
        this.divMenu.style.left =typeof(y) == 'number'? `${y}px`: y;}

    #opacidadVentanas(n,accion){
        if(!kernel.esWindows)
            globalVanie.ventanasForEach(vanie =>{
                if(vanie.esVisible){
                    vanie.ventana.classList[accion](globalVanie.globalClass('animacion'));
                    if(n != undefined)vanie.opacidad = n}});}

    mostrar(){
        if(this.esVisible) return;
        this.visible = true;
        
        this.divMenu.style.display = 'flex';
        this.#opacidadVentanas(0,'add');
        
        this.divMenu.style.zIndex = globalVanie.ventanasVisibles + 1;
        kernel.DOCK.zIndex = this.divMenu.style.zIndex + 1;       
        
        setTimeout(()=>{
            this.divMenu.classList.add(globalVanie.globalClass('animacion'));
            this.divMenu.style.opacity = 1;},10);}


    ocultar(){
        if(!this.esVisible) return;
        this.visible = false;

        this.#opacidadVentanas(1,'remove');
        this.divMenu.classList.add(globalVanie.globalClass('animacion'));
        this.divMenu.style.opacity = 0;
        this.divMenu.style.zIndex = -1;}

    interruptor(e){
        if(this.esVisible) this.ocultar();
        else this.mostrar();
        kernel.ocultarTodasLasMiniaturas();
        kernel.DOCK.activar(e);}

    agregarAplicaciones(nombre,rutaIco,aplicacion){
        this.#estrurador();
        const div = document.createElement('div');
        const span = document.createElement('span');
        const ico = document.createElement('img');
        div.appendChild(ico);
        div.appendChild(span);

        span.innerText = nombre;
        span.classList.add(globalVanie.globalClass('bloqueado'));

        div.style.display = 'inherit';
        ico.setAttribute('src',rutaIco);
        ico.style.aspectRatio = 1;

        let clickeable = div;

        if(!kernel.esWindows){
            clickeable = ico;
            div.style.placeItems = 'center';
            ico.style.width = '80px';}

        clickeable.addEventListener('click',()=>{
            this.ocultar();
            if(aplicacion) aplicacion.nuevaVentana();});

        //this.listaApps.push({nombre:nombre,ico:ico});
        this.estructura.get('app_contenedor').appendChild(div);}

    reEstructurar(){
        const cn = this.estructura.get('app_contenedor');
        const va = this.estructura.get('var_contenedor');
        const bs = this.estructura.get('buscador');
        cn.removeAttribute('style');
        va.removeAttribute('style');
        bs.removeAttribute('style');
        this.divMenu.removeChild(cn);
        this.divMenu.removeChild(va);
        this.divMenu.removeChild(bs);
        const menu = this.divMenu.style;
        menu.flexDirection = menu.alignItems = menu.justifyContent = '';
        this.#estrurador();
    }

    #estrurador(){
        const contenedor = this.estructura.get('app_contenedor');
        const cosillas = this.estructura.get('var_contenedor');
        const buscador = this.estructura.get('buscador');
        const menu = this.divMenu.style;       
        
        this.divMenu.appendChild(buscador);
        this.divMenu.appendChild(contenedor);

        let w = '100%';
        let h = '100%';
        let display = 'flex'
        
        buscador.style.width = cosillas.style.width = contenedor.style.width = '100%';
    
        if(!kernel.esWindows){
            display = 'grid';
            let gap = '20px'
            let columnas = 'repeat(7,1fr)';
            let alturaBuscador = '60px'
            let dimencionMax = '1000px'
            menu.flexDirection = 'column';
            menu.alignItems = 'center';
            
            if(kernel.esLinux){
                this.divMenu.insertBefore(contenedor,cosillas);}
            else{
                buscador.style.marginBottom = gap;}

            contenedor.style.width = '80%';
            contenedor.style.maxWidth = dimencionMax;
            buscador.style.height = alturaBuscador;
            contenedor.style.gap = gap;
            contenedor.style.gridTemplateColumns = columnas;
        }

        else {
            this.divMenu.appendChild(cosillas);
            menu.flexDirection = 'column';}

        contenedor.style.display = display;
    }

    addEventListener(accion,funcion){
        if(typeof(accion) != 'string' || typeof(funcion) != 'function') return;
        this.divMenu.addEventListener(accion,funcion);}

    get lanzador(){return this.#app;}
    get esVisible(){return this.visible;}}