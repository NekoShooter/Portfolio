import kernel from "./Kernel";
import { Dimension, Rect } from 'nauty';

export default class Lanzador{
    #contenedor;
    #icono;
    #marcador;
    #nombre;
    #insertado = false;
    #medida = kernel.data.medidaLanzador;
    #ruta_ico;
    #es_fijo = false;
    #transicion = 'all .3s ease';
    #apertura = false;
    #llave;

    get contenedor(){return this.#contenedor;}
    get icono(){return this.#icono;}
    get nombre(){return this.#nombre;}
    get esfijo(){return this.#es_fijo;}
    get estaConstruido(){return this.#contenedor && this.#icono && this.#marcador;}
    get dataValida(){return this.#nombre && this.#ruta_ico;}
    get numMarcadores(){return kernel.esLinux ? 4 : 1;}

    constructor(nombre,ruta_ico,esfijo=false){
        this.data(nombre,ruta_ico,esfijo);
        this.crear();}
    
    data(nombre,ruta_ico,esfijo){
        if(typeof(nombre) != 'string' || typeof(ruta_ico) != 'string') return;
        this.#es_fijo = esfijo;
        this.#nombre = nombre;
        this.#ruta_ico = ruta_ico;}

    crear(){
        if(!this.dataValida) return;

        if(!this.estaConstruido){
            this.#contenedor = document.createElement('div');
            this.#icono = document.createElement('img');
            this.#marcador = document.createElement('div');

            this.#contenedor.addEventListener('transitionend',()=>{
                if(this.esfijo) return;
    
                this.#contenedor.style.transform = this.#contenedor.style.transition = this.#contenedor.style.opacity ='';

                if(!this.#apertura){this.remover();}});};

        this.#icono.setAttribute('src',this.#ruta_ico);

        if(this.esfijo){this.#contenedor.style.width = `${this.#medida}px`;}
        this.#unix();}


    cambiarIco(ruta_ico){
        if(typeof ruta_ico != 'string' && this.#es_fijo == ruta_ico) return;

        this.#ruta_ico = ruta_ico;
        this.#icono?.setAttribute('src',this.#ruta_ico);}

    insertar(){
        if(this.#insertado) return;
        kernel.DOCK.contenedor.appendChild(this.#contenedor);
        this.#llave = kernel.DOCK.registrarLanzador(this);
        this.#insertado = true;}

    remover(){
        if(!this.#llave || !this.#insertado) return;
        kernel.DOCK.contenedor.removeChild(this.#contenedor);
        kernel.DOCK.desconectarLanzador(this.#llave);
        this.#insertado = false;}

    #unix(){
        for(let i = 0; i < this.numMarcadores; ++i){
            const punto = document.createElement('div');
            punto.style.display = 'none';
            this.#marcador.appendChild(punto);}
            
        this.#contenedor.appendChild(this.#icono);
        this.#contenedor.appendChild(this.#marcador);}

    apertura(){
        if(this.#insertado) return;
        if(!this.#insertado && this.estaConstruido) this.insertar();
        if(this.esfijo || !this.estaConstruido){this.#insertado = this.estaConstruido; return;}
        
        const n = -this.#medida/2;
        this.#contenedor.style.transform = kernel.DOCK.esVertical ? `translateX(${n}px)` : `translateY(${n}px)`;
        this.#contenedor.style.width = '0px';
        this.#apertura = true;
        setTimeout(()=>{
            this.#contenedor.style.transition = this.#transicion;
            this.#contenedor.style.transform = kernel.DOCK.esVertical ? 'translateY(0px)' : 'translateX(0px)';
            this.#contenedor.style.width = `${this.#medida}px`;
            },10);}
    
    colapso(){
        if(this.esfijo || !this.estaConstruido) return;
        this.#apertura = false;
        this.#contenedor.style.transition = this.#transicion;
        this.#contenedor.style.opacity = 0;
        const transladar = kernel.DOCK.esVertical ? 
            `translateX(${-this.#contenedor.offsetWidth/2}px)`:
            `translateY(${-this.#contenedor.offsetHeight/2}px)`;

        this.#contenedor.style.transform = transladar;
        this.#contenedor.style.width = '0px';}

    #interuptorMarcador(n,str){
        const marcador = this.#marcador.childNodes;
        for(let i = 0; i < marcador.length && n; ++i){
            if(marcador[i].style.display == str) continue;
            marcador[i].style.display = str;
            --n;}}

    mostrarMarcador(num_marcadores = 1){this.#interuptorMarcador(num_marcadores,'');}
    quitarMarcador(num_marcadores = 1){this.#interuptorMarcador(num_marcadores,'none');}

    addEventListener(accion,funcion){
        if(!this.estaConstruido || typeof(accion) != 'string' || typeof(funcion) != 'function') return;
        const elemento =kernel.esMac ? this.#icono : this.#contenedor;
        elemento.addEventListener(accion,funcion);}

    limpiar(){
        this.#contenedor = this.#icono = this.#marcador = undefined;
        this.#nombre = this.#ruta_ico = undefined;
        this.es_fijo = false;}

    get coordenadaRelativa(){
        if(!this.estaConstruido || !this.#insertado) return {x:0,y:0}
        return {x: this.#contenedor.offsetLeft, y:this.#contenedor.offsetTop};}

    get coordenadaAbsoluta(){
        if(!this.estaConstruido || !this.#insertado) return {x:0,y:0};
        return {x: this.#contenedor.getBoundingClientRect().left, y:this.#contenedor.getBoundingClientRect().top};}
    get rect(){return new Rect(this.#contenedor);}
    get dimencion(){return new Dimension(this.#contenedor);}}