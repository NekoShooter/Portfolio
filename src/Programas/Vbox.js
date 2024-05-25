import Vanie from 'vanie';
import { ico } from '../Data/iconos';
import Aplicacion from '../Sistema/Aplicacion'
import kernel from '../Sistema/Kernel';
import { moldeBipanel } from '../Data/moldes'

export default class Vbox{
    #app= new Aplicacion('VBoxManage','virtual box',ico.VBoxManage);;
    #ventana = new Vanie;
    constructor(){
        kernel.registrarApp(this.#app.comando,this.#app.id,this);}

    #construir(){
        const [contenedor,derecho,izquierdo] = moldeBipanel();
        this.#ventana.lienzo.appendChild(contenedor);
    }

    abrir(){
        if(!this.#app.ventanaUnica)
            this.#app.agregarVentanaUnica(this.#ventana,this.#app.id);
        this.#app.abrir();}
}