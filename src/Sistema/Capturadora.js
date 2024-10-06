import Lanzador from "./Lanzador";
import { Dimension, Punto , Rect, rotar } from "nauty";
import { globalVanie } from "vanie";
import kernel from "./Kernel";
import { moldeBoton, moldeTitulo } from "../Data/moldes";

export default class Capturadora{
    #padre;
    #contenedor;
    #fnMini;
    #llave;
    #lista_capturas = new Map;
    #visible = false;
    #lanzador;

    constructor(){
        this.#visible = false;
        this.conectarseA(kernel.DOCK.padre)}

    get dimension(){ return new Dimension(...({windows:[120,75],linux:[120,75],mac:[120,75]}[kernel.os]));}
    get esValido(){return Boolean(this.#padre);}
    get contenedorPrincipal(){return this.#contenedor ?? this.#lanzador.contenedor;}
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

    #estiloContenedor(){}

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
        let {x,y} = this.#lanzador?.coordenadaAbsoluta ?? {x:0,y:0};
        const medidaLanzador = kernel.data.medidaLanzador;
        const {w,h} = this.#lanzador?.dimencion ?? {w:medidaLanzador,h:medidaLanzador};
        if(kernel.DOCK.esVertical) x = x + w;
        else if(kernel.esWindows)y = y + h;
        else y = -h;
        return {x:x,y:y}
        //return p;
    }

    #frame(ventana,identificador,miniatura){
        if(!miniatura || !ventana) return;
        miniatura.classList.add(globalVanie.globalClass('bloqueado'));
        const frame = document.createElement('div');
        const contenedorTxt = document.createElement('div');
        const contenedorTitulo  = moldeTitulo(ventana.titulo);
        contenedorTxt.appendChild(contenedorTitulo);
        frame.appendChild(contenedorTxt);
        const btn = moldeBoton('./recursos/iconos/x.svg',()=>{
            ventana.cerrar();
            this.removerCaptura(identificador);});

        if(kernel.esMac){
            contenedorTitulo.classList.add('acrilicoBlack');
            btn.firstChild.classList.add('acrilicoBlack');}     
        frame.appendChild(btn);
        frame.appendChild(miniatura);
        return frame;}

    removerCaptura(identificador){
        this.ocultarMiniaturas();
        const captura = this.eliminarCaptura(identificador);
        if(!captura) return;
        this.contenedorPrincipal.removeChild(captura);}

    crearCaptura(identificador,ventana){
        if(typeof identificador != 'string' || identificador == ''|| !ventana) return;
        if(!this.#llave) this.#llave = kernel.registrarCapturadora(this);

        const captura = this.#frame(ventana,identificador,this.#fnMini?.(identificador,this.dimension));
        if(!captura) return;

        this.#lista_capturas.set(identificador,captura);

        captura.addEventListener('click',()=>{
            if(!this.#lista_capturas.get(identificador)) return;
            ventana.abrir();
            this.ocultarMiniaturas();});

        const estilos = {mac:'mini-mac',windows:'',linux:''}[kernel.os];
        captura.classList.add(globalVanie.globalClass('animacion'),estilos);
        const [w,h] = this.dimension.data;
        captura.style.width = `${w}px`;
        captura.style.height = `${h}px`;
        captura.style.opacity = 0;
        captura.style.display = 'none';
        this.#transitionend(captura);

        if(kernel.esMac)this.#lanzador.contenedor.appendChild(captura);
        else{
            this.#crearContenedor();
            this.#contenedor.appendChild(captura);}}

    desconertarDelKernel(){
        kernel.removerCapturadora(this.#llave);
        this.#llave = undefined;}


    #asignarCoordenadas(){
        if(kernel.esMac){
            const h = this.dimension.h;
            const radio = new Punto(1920,h/2);
            let grados = 0;

            this.capturas.forEach(miniatura=>{
                const referencia = new Rect(miniatura);
                miniatura.style.opacity = 1;
                miniatura.style.transform = rotar(grados,radio,referencia.obtenerCentro()).str;
                grados -=3;
                miniatura.style.top = `${-(h + 10)}px`;});}}


    mostrarMiniaturas(){
        if(!this.esValido || this.#visible) return;
        kernel.miniaturasVisible = this;
        kernel.bloquearEscritorio(true);
        if(this.#contenedor) this.#contenedor.style.display='';
        else this.capturas.forEach(miniatura=>{
            miniatura.style.display= '';
            miniatura.style.zIndex = kernel.DOCK.zIndex + 1;});
        
        setTimeout(()=>{
            this.#visible = true;
            this.#asignarCoordenadas();},50);}

    ocultarMiniaturas(){
        if(!this.esValido || !this.#visible) return;
        kernel.miniaturasVisible = undefined;
        kernel.bloquearEscritorio(false);
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
        this.#contenedor.style.left = typeof x == 'number'? `${x}px`: x;
        this.#contenedor.style.top = typeof y == 'number'?`${y}px`:y;}

    eliminarCaptura(identificador){
        const captura = this.#lista_capturas.get(identificador);
        if(!captura) return;
        this.#lista_capturas.delete(identificador);
        return captura;}

    dameCaptura(identificador){return this.#lista_capturas.get(identificador);}
    
}
