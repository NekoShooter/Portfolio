import kernel from "./Kernel";
import { globalVanie } from "vanie";
/*
export default class Dock{
    #padre;
    #contenedor;
    #activo = true;
    #medidaDock;
    #mapLanzador = new Map;
    #registros = 0;

    constructor(padre = undefined,configuracion){
        if(!(padre instanceof HTMLElement)) throw('Asignacion de padre obligatoria');
        padre.style = '';
        this.#medidaDock = configuracion.medidaDock;
        this.eliminar();
        this.cambiarPadre(padre);}

    eliminar(){
        if(this.estaConstruido) this.#padre.removeChild(this.#contenedor);
         this.#padre = this.#contenedor = undefined;}

    cambiarPadre(nuevoPadre){
        if(!nuevoPadre || nuevoPadre === this.#padre) return;
        if(this.estaConstruido){
            try{ 
            if(this.#padre) this.#padre.removeChild(this.#contenedor);
            nuevoPadre.appendChild(this.#contenedor);}
            catch(error){
                console.error("error al asignar al nuevo padre");
                return error;}}

        this.#padre = nuevoPadre;
        this.#reconstruir();}

    registrarLanzador(lanzador){
        if(!lanzador) return;
        const llave = `l${this.#registros++}`
        this.#mapLanzador.set(llave,lanzador);
        this.actualizarLazadores();
        return llave;}

    desconectarLanzador(llave){
        const lanzador = this.#mapLanzador.get(llave);
        if(!lanzador) return;
        this.#mapLanzador.delete(llave);
        this.actualizarLazadores();}

    actualizarLazadores(){
        this.#mapLanzador.forEach(lanzador=>{
            lanzador.ventanas?.forEach(ventana=>{
            const dim = lanzador.dimencion;
            const pos = lanzador.coordenadaAbsoluta;
            ventana.cambiarPuntoDeRetorno(pos.x + dim.w/2, pos.y + dim.h/2);});
        });}
    

    get estaConstruido(){ return this.#padre && this.#contenedor;}
    get nodos(){
        if(!this.estaConstruido) return [];
        return this.#contenedor.childNodes;}
    get contenedor(){return this.#contenedor;}
    get zIndex(){return this.#contenedor?.style.zIndex;}
    set zIndex(num){if(this.#contenedor) this.#contenedor.style.zIndex = num;}
    get estaActiva(){return this.#activo}
    set padre(padre){this.cambiarPadre(padre);}
    get padre(){return this.#padre;}
    get esVertical(){return kernel.esLinux;}
    get esHorizontal(){return !this.esVertical;}
        
    #reconstruir(){
        if(!this.#padre || this.estaConstruido) return;
        this.#contenedor = document.createElement('div');
        this.#estilador();
        this.#padre.appendChild(this.#contenedor);}

    #estilador(){
        this.#contenedor.style = '';
        this.#modificaDimencion();}

    #modificaDimencion(){
        if(!this.#contenedor) return;
        const med = this.esHorizontal ? 'height' : 'width';
        this.#contenedor.style[med] = `${this.#medidaDock}px`;}    
}
*/
export default class Dock{
    #padre;
    #contenedor;
    #activo = true;
    #medidaDock;
    #mapLanzador = new Map;
    #registros = 0;

    #indiceActual = 0;
    #medidaLanzador;
    #funcionEnter;
    #funcionMove;
    #funcionLeave;

    constructor(padre = undefined,configuracion){
        if(!(padre instanceof HTMLElement)) throw('Asignacion de padre obligatoria');
        padre.style = '';
        this.#medidaDock = configuracion.medidaDock;
        this.#medidaLanzador = configuracion.medidaLanzador;

        this.eliminar();
        this.cambiarPadre(padre);

        this.restaurar = this.restaurar.bind(this);
        this.asignarFunciones();
        this.#eventos();
    }

    get seAsignoFunciones(){return this.#funcionLeave && this.#funcionMove;}

    eliminar(){
        if(this.estaConstruido) this.#padre.removeChild(this.#contenedor);
         this.#padre = this.#contenedor = undefined;}

    cambiarPadre(nuevoPadre){
        if(!nuevoPadre || nuevoPadre === this.#padre) return;
        if(this.estaConstruido){
            try{ 
            if(this.#padre) this.#padre.removeChild(this.#contenedor);
            nuevoPadre.appendChild(this.#contenedor);}
            catch(error){
                console.error("error al asignar al nuevo padre");
                return error;}}

        this.#padre = nuevoPadre;
        this.#reconstruir();}

    registrarLanzador(lanzador){
        if(!lanzador) return;
        const llave = `l${this.#registros++}`
        this.#mapLanzador.set(llave,lanzador);
        this.actualizarLazadores();
        return llave;}

    desconectarLanzador(llave){
        const lanzador = this.#mapLanzador.get(llave);
        if(!lanzador) return;
        this.#mapLanzador.delete(llave);
        this.actualizarLazadores();}

    actualizarLazadores(){
        this.#mapLanzador.forEach(lanzador=>{
            lanzador.ventanas?.forEach(ventana=>{
            const dim = lanzador.dimencion;
            const pos = lanzador.coordenadaAbsoluta;
            ventana.cambiarPuntoDeRetorno(pos.x + dim.w/2, pos.y + dim.h/2);});
        });}
    

    get estaConstruido(){ return this.#padre && this.#contenedor;}
    get nodos(){
        if(!this.estaConstruido) return [];
        return this.#contenedor.childNodes;}
    get contenedor(){return this.#contenedor;}
    get zIndex(){return this.#contenedor?.style.zIndex;}
    set zIndex(num){if(this.#contenedor) this.#contenedor.style.zIndex = num;}
    get estaActiva(){return this.#activo}
    set padre(padre){this.cambiarPadre(padre);}
    get padre(){return this.#padre;}
    get esVertical(){return kernel.esLinux;}
    get esHorizontal(){return !this.esVertical;}
        
    #reconstruir(){
        if(!this.#padre || this.estaConstruido) return;
        this.#contenedor = document.createElement('div');
        this.#estilador();
        this.#padre.appendChild(this.#contenedor);}

    #estilador(){
        this.#contenedor.classList.remove(...this.#contenedor.classList);
        this.#contenedor.classList.add('acrilico',`dock_${kernel.os}`);
        this.#modificaDimencion();}

    #modificaDimencion(){
        if(!this.#contenedor) return;
        const med = this.esHorizontal ? 'height' : 'width';
        this.#contenedor.style[med] = `${this.#medidaDock}px`;}

    restaurar(){
        kernel.bloquearEscritorio(false);
        if(kernel.esMac)
        this.nodos.forEach(div=>
            {div.style.width = `${this.#medidaLanzador}px`});}

    #eventoBuscarIndice(){
        if(!this.estaConstruido) return;

        this.contenedor.addEventListener('mouseenter',e=>{
            if(!this.nodos?.length) return;
            kernel.bloquearEscritorio(true);
            this.zIndex = globalVanie.ventanasVisibles + 2;

            const data = {mov: e.offsetX, tam:this.nodos.length * this.contenedor.lastChild.offsetWidth}

            this.#indiceActual = ~~((((data.mov * this.nodos.length)) / data.tam))|0;

            if(this.#indiceActual >=  this.nodos.length) 
                this.#indiceActual = this.nodos.length - 1;});
    }

    #eventos(){
        this.#eventoBuscarIndice();

        //ANIMACION AUMENTO
        this.contenedor.addEventListener('mousemove',e =>{
            this.#afirmarIndice(e);
            if(this.nodos[this.#indiceActual]?.getBoundingClientRect().top < e.clientY)
                this.#efectoLupa(e);});

        //VOLVER A SU ESTADO NORMAL
        this.contenedor.addEventListener('mouseleave',this.restaurar);
    }

    asignarFunciones(){
        if(!this.estaConstruido) return;

        if(this.seAsignoFunciones){
            this.contenedor.removeEventListener('mousemove',this.#funcionMove);
            this.contenedor.removeEventListener('mouseleave',this.#funcionLeave);
            this.contenedor.removeEventListener('mouseenter',this.#funcionLeave);}

        if(kernel.esMac){

            this.#funcionMove = e=>{
                this.#afirmarIndice(e);
                if(this.nodos[this.#indiceActual]?.getBoundingClientRect.top < e.clientY)
                    this.#efectoLupa(e);}

            this.#funcionLeave = this.restaurar;

            this.#funcionEnter = e=>{
                if(!this.nodos?.length) return;
                kernel.bloquearEscritorio(true);
                this.zIndex = globalVanie.ventanasVisibles + 2;

                const data = {mov: e.offsetX, tam:this.nodos.length * this.contenedor.lastChild.offsetWidth}

                this.#indiceActual = ~~((((data.mov * this.nodos.length)) / data.tam))|0;

                if(this.#indiceActual >=  this.nodos.length) 
                    this.#indiceActual = this.nodos.length - 1;}
        }

        this.#funcionMove = this.#funcionMove.bind(this);
        this.#funcionLeave = this.#funcionLeave.bind(this);
        this.#funcionEnter = this.#funcionEnter.bind(this);

        this.contenedor.addEventListener('mousemove',this.#funcionMove);
        this.contenedor.addEventListener('mouseleave',this.#funcionLeave);
        this.contenedor.addEventListener('mouseenter',this.#funcionLeave);   
    }

    #afirmarIndice(e){
        const contendorActual = this.nodos[this.#indiceActual];

            //if(!this.orientacion || !contendorActual) return;
            if(!contendorActual) return;

            const data = {mov: e.clientX, pos:contendorActual.getBoundingClientRect().left,tam: contendorActual.offsetWidth}

            const inicio = data.pos;
            const fin = inicio + data.tam;

            if(data.mov > fin){
                this.#indiceActual = (this.#indiceActual + 1) >= contendorActual.length ? 
                    contendorActual.length - 1 : this.#indiceActual + 1;}

            if (data.mov < inicio){
                this.#indiceActual = (this.#indiceActual - 1) < 0 ? 0: this.#indiceActual - 1;}}

    #efectoLupa(e){
        if(this.#indiceActual == undefined || !this.estaActiva || !e) return;
        const posX = e.clientX;

        const redimencionar = (div)=>{
            if(!div) return;
            const media = div.getBoundingClientRect().left + (div.offsetWidth/2);
            const diferencia = (posX < media)? posX/media: media/posX;
            const dimencionParcial = Math.pow(diferencia,2) * this.#medidaLanzador;
            const dimencionFinal = dimencionParcial * 2;
            div.style.width =`${dimencionFinal < this.#medidaLanzador ? this.#medidaLanzador: dimencionFinal}px`;}

        requestAnimationFrame(()=>{
            
            redimencionar(this.nodos[this.#indiceActual]);

            const limite = 3
            for(let i = 1; i < limite; ++i){
                redimencionar(this.nodos[this.#indiceActual + i]);
                redimencionar(this.nodos[this.#indiceActual - i]);}
            for(let d = this.#indiceActual + limite; d < this.nodos.length; ++d)
                this.nodos[d].style.width = `${this.#medidaLanzador}px`
            for(let t = this.#indiceActual - limite; t >= 0; --t)
                this.nodos[t].style.width = `${this.#medidaLanzador}px`});}

    desactivar(){this.restaurar();}
    activar(e){this.#efectoLupa(e);}
    interruptor(e){this.#efectoLupa(e);}
}