import kernel from "./Kernel";

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