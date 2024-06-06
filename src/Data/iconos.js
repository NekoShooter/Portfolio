import kernel from "../Sistema/Kernel";
const url ={
    vanie:'https://www.npmjs.com/package/vanie',
    nauty:'https://www.npmjs.com/package/nauty',
    linkedin:'https://www.linkedin.com/in/neko-shooter/',
    github:'https://github.com/NekoShooter',
    npm:'https://www.npmjs.com/~neko_shooter'
}

const ICONOS = {
    mac:{
        menu:{
            ico:"./recursos/iconos_mac/launchpad.png",
            nombre:"Launchpad"},
        home:{
            ico:"./recursos/iconos_mac/finder.png",
            ico2:"https://cdn.icon-icons.com/icons2/602/PNG/512/Home_icon-icons.com_55890.png",
            nombre:"Finder"},
        terminal:{
            ico:"./recursos/iconos_mac/terminal.png",
            nombre:"Terminal"},
        navegador:{
            ico:"./recursos/iconos_mac/safari.png",
            nombre:"Safari"},
        preferencias:{
            ico:"./recursos/iconos_mac/preferncias.png",
            nombre:"preferencias"},
        folder:{
            ico:"https://cdn.icon-icons.com/icons2/1503/PNG/512/folder_103595.png",
            nombre:'folder'},
        app:{
            ico:'./recursos/iconos_mac/App_store.png',
            ico2:'https://cdn.icon-icons.com/icons2/622/PNG/512/app-store-apple-symbol_icon-icons.com_57185.png',
            nombre:"AppStore"},
        proyecto:{
            ico: "https://cdn.icon-icons.com/icons2/1481/PNG/512/41filedocumentprocess_102074.png",
            ico2: "https://cdn.icon-icons.com/icons2/1481/PNG/512/41filedocumentprocess_102074.png"},
        video:{
            ico:'https://cdn.icon-icons.com/icons2/1933/PNG/512/iconfinder-video-film-movie-camera-multimedia-4593168_122276.png',
            ico2:'https://cdn.icon-icons.com/icons2/1933/PNG/512/iconfinder-video-film-movie-camera-multimedia-4593168_122276.png',},
        archivo:{
            ico:'https://cdn.icon-icons.com/icons2/39/PNG/128/Newfile_page_document_empty_6315.png'
        }}
};
const miniIco = {
    mac:{ home: 'https://cdn.icon-icons.com/icons2/602/PNG/512/Home_icon-icons.com_55890.png',
        app:'https://cdn.icon-icons.com/icons2/622/PNG/512/app-store-apple-symbol_icon-icons.com_57185.png',
        proyecto:'https://cdn.icon-icons.com/icons2/1481/PNG/512/41filedocumentprocess_102074.png',
        video:'https://cdn.icon-icons.com/icons2/1933/PNG/512/iconfinder-video-film-movie-camera-multimedia-4593168_122276.png',

    }
}
const ico = {
    js:'https://cdn.icon-icons.com/icons2/2107/PNG/512/file_type_js_official_icon_130509.png',
    html:'./recursos/iconos/html.svg',
    css:'./recursos/iconos/css.svg',
    c:'https://i.ibb.co/1Q10GFX/C.png',
    cpp:'https://i.ibb.co/hd3yP7D/C.png',
    py:'https://cdn.icon-icons.com/icons2/2699/PNG/512/python_logo_icon_168886.png'
}

const icoOs = {
    mac:'https://cdn.icon-icons.com/icons2/643/PNG/512/mac-apple-osx-desktop-software-hardware_icon-icons.com_59289.png',
    linux: 'https://cdn.icon-icons.com/icons2/70/PNG/512/ubuntu_14143.png',
    windows:'https://cdn.icon-icons.com/icons2/643/PNG/512/windows-square-shape-brand_icon-icons.com_59257.png',
}

function icon(alias){
    const icono = ico[alias];
    if(!icono) return miniIco[kernel.os][alias];
    return icono;}

function logoOs(){return icoOs[kernel.os];}
    
export {ICONOS , ico , icon , logoOs, icoOs , url}
export default icon;