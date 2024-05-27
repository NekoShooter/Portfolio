import Lanzador from "./Lanzador";
import { Punto , Rect, rotar } from "nauty";
import Vanie, { globalVanie } from "vanie";
import kernel from "./Kernel";

export default class Capturadora{
    #padre;
    #contenedor;
    #fnMini;
    #w; #h;
    #llave;
    #posMimi;
    #lista_capturas = new Map;
    #visible = false;
    #lanzador;

    constructor(){
        const{w,h}={windows:{w:120,h:72},
                    linux:{w:120,h:72},
                    mac:{w:120,h:72}}[kernel.os];
        this.#w = w;
        this.#h = h;
        this.#visible = false;
        this.conectarseA(kernel.DOCK.padre)}

    get esValido(){return Boolean(this.#padre);}
    get contenedorPrincipal(){return this.#contenedor ?? this.#padre;}
    get padre(){return this.#padre;}
    get esVisible(){return this.#visible;}
    get capturas(){return this.#lista_capturas;}
    get capturasAlmacenadas(){return this.#lista_capturas.size;}
    get capturaPersonalizada(){return this.#fnMini;}
    set capturaPersonalizada(funcion){if(typeof funcion == 'function') this.#fnMini = funcion;}
    
    
    #crearContenedor(){
        if(!this.esValido || this.#contenedor || kernel.esMac) return;
        this.#contenedor = document.createElement('div');
        this.#contenedor.style.display = 'none';
        this.#estiloContenedor();
        this.#padre.appendChild(this.#contenedor);}

    #estiloContenedor(){
        let med = {w:`${this.w}px`,h:'fit-content'}
        this.#contenedor.style.flexDirection = 'row';
        if(kernel.DOCK.esVertical){
            this.#contenedor.style.flexDirection = 'column';
            med = {w:'fit-content',h:`${this.h}px`};}
        this.#contenedor.style.width = med.w;
        this.#contenedor.style.height = med.h;}

    conectarseA(padre){
        if(!padre) return;
        if(this.#padre) this.#padre.removeChild(this.#contenedor);
        if(this.#contenedor) padre.appendChild(this.#contenedor);
        this.#padre = padre;
        this.#padre.style.position = 'relative';
        this.#crearContenedor();}

    conectarLanzador(lanzador){
        if(!(lanzador instanceof Lanzador)) return;
        this.#lanzador = lanzador;}

    #dameCoordenadas(){
        let {x,y} = this.#lanzador?.coordenadaRelativa ?? {x:0,y:0};
        const medidaLanzador = kernel.data.medidaLanzador;
        const {w,h} = this.#lanzador?.dimencion ?? {w:medidaLanzador,h:medidaLanzador};
        if(kernel.DOCK.esVertical) x = x + w;
        else if(kernel.esWindows)y = y + h;
        else y = 0;
        return {x:x,y:y}}

        
    #estiloDivCap(div,marco,btn){
        div.style = '';
        marco.style.width = `${this.#w}px`;
        marco.style.height = `${this.#h}px`;
        div.style.flexDirection = 'column';
        btn.style = `position:absolute; right:0; top:0; cursor:default; z-index:99;`;

        if(this.#fnMini){
            div.style.position = 'absolute';
            div.style.display = 'flex';
            div.style.alignItems = div.style.justifyContent = 'center';}
        else{
            div.style.position = 'relative';
            div.style.overflow = 'hidden';}}

    crearCaptura(identificador,ventana){
        if(typeof identificador != 'string' || identificador == '') return;
        if(!this.#llave) this.#llave = kernel.registrarCapturadora(this);
        
        let captura = undefined;
        let miniatura = undefined;

        if(!captura) {
            captura = document.createElement('div');
            const marco = document.createElement('div');
            const btnCerrar = document.createElement('buttom');
            const ico = new Image(20,20);
            ico.setAttribute('src','./recursos/iconos/x.svg');
            btnCerrar.appendChild(ico);
            captura.appendChild(btnCerrar);
            captura.appendChild(marco);

            btnCerrar.addEventListener('click',()=>{
                ventana.cerrar();
                this.ocultarMiniaturas();
                this.contenedorPrincipal.removeChild(captura);
                this.eliminarCaptura(identificador);});

            marco.addEventListener('click',()=>{
                ventana.abrir();
                this.ocultarMiniaturas();});
            captura.classList.add(globalVanie.globalClass('animacion'));
            captura.style.opacity = 0;
            this.#transitionend(captura);
            this.#estiloDivCap(captura,marco,btnCerrar);
            this.#lista_capturas.set(identificador,captura);
            if(this.#fnMini)miniatura = this.#fnMini(identificador,{w:this.#w,h:this.#h});}

        else if(ventana instanceof Vanie) captura.removeChild(captura.firstChild);
        else return;

        if(!miniatura && ventana instanceof Vanie){
            const w = ventana.lienzo.offsetWidth;
            const h = ventana.lienzo.offsetHeight;
    
            miniatura = ventana.lienzo.cloneNode(true);
            miniatura.classList.add(globalVanie.globalClass('bloqueado'));
    
            miniatura.style.scale = (w > h) ? this.#w/w : this.#h/h;
            miniatura.style.left = `${-(w - this.#w)/2}px`;
            miniatura.style.top = `${-(h - this.#h)/2}px`;
            miniatura.style.position = 'absolute';}

        else if(!miniatura){
            this.#lista_capturas.delete(identificador);
            return;}
            
        captura.childNodes[1].appendChild(miniatura);}

    reacomodar(){
        if(!this.esVisible) return;
        const {x,y} = this.#dameCoordenadas();
        this.capturas.forEach(miniatura=>{
            const rect = new Rect(miniatura,true);
            rect.posicionarPorElCentro(x,rect.y/2);});}

    acomodar(){
        if(!this.esVisible) return;
        const {x,y} = this.#dameCoordenadas();
        const separacion = 10;
        let distancia = separacion + this.#h;
        this.#posMimi = {x:`${x}px`,y:`${y - distancia}px`}
        this.capturas.forEach(miniatura=>{
            miniatura.style.top = this.#posMimi.y;
            miniatura.style.left = this.#posMimi.x;});}

    desconertarDelKernel(){
        kernel.removerCapturadora(this.#llave);
        this.#llave = undefined;}


    #asignarCoordenadas(){
        const {x,y} = this.#dameCoordenadas();
        if(kernel.esMac){
            const separacion = 10;
            let distancia = separacion + this.#h;

            const radio = new Punto(x+1920,distancia/2);
            let grados = 0;
            this.#posMimi = {x:`${x}px`,y:`${y - distancia}px`}
            this.capturas.forEach(miniatura=>{
                this.contenedorPrincipal.appendChild(miniatura);
                const referencia = new Rect(miniatura);
                miniatura.style.opacity = 1;
                miniatura.style.transform = rotar(grados,radio,referencia.obtenerCentro()).str;
                grados -=3;
                miniatura.style.top = this.#posMimi.y;
                miniatura.style.left = this.#posMimi.x;});}}


    mostrarMiniaturas(){
        if(!this.esValido || this.#visible) return;
        kernel.miniaturasVisible = this;
        globalVanie.ventanasForEach(ventana=>{
            if(ventana.esSuperior) ventana.bloquearIframe(true);
        });

        if(this.#contenedor) this.#contenedor.style.display='flex';
        else this.capturas.forEach(miniatura=>{
            miniatura.style.display= 'flex';
            miniatura.style.zIndex = kernel.DOCK.zIndex + 1;});
        
        setTimeout(()=>{
            this.#visible = true;
            this.#asignarCoordenadas();},50);}

    ocultarMiniaturas(){
        if(!this.esValido || !this.#visible) return;
        kernel.miniaturasVisible = undefined;
        globalVanie.ventanasForEach(ventana=>{
            if(ventana.esSuperior) ventana.bloquearIframe(false);
        });
        this.#visible = false;
        this.capturas.forEach(miniatura=>{
            miniatura.style.opacity = 0;
            miniatura.style.transform= '';});}

    #transitionend(miniatura){
        miniatura.addEventListener('transitionend',()=>{
            if(!this.#visible){
                if(this.#contenedor) this.#contenedor.style.display = 'none';
                else{
                    miniatura.style.display='none';
                    miniatura.style.zIndex = 0;}}});}

    interruptorMiniaturas(){
        if(this.#visible) this.ocultarMiniaturas();
        else this.mostrarMiniaturas();}

    posicionDelContenedor(x,y){
        if(!this.#contenedor || typeof(x) != 'number' || typeof(y) != 'number') return;
        this.#contenedor.style.display= 'none';
        this.#contenedor.style.left = `${x}px`;
        this.#contenedor.style.top = `${y}px`;}

    eliminarCaptura(identificador){
        const captura = this.#lista_capturas.get(identificador);
        if(!captura) return;
        this.#lista_capturas.delete(identificador);}

    dameCaptura(identificador){return this.#lista_capturas.get(identificador);}
    
}
