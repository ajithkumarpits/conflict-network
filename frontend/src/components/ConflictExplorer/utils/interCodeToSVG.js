import diamond_icon from '../assets/icons/diamond_icon';
import square_icon from '../assets/icons/square_icon';
import cross_icon from '../assets/icons/cross_icon';
import fence_icon from '../assets/icons/fence_icon';
import multistar_icon from '../assets/icons/multistar_icon';
import spike_icon from '../assets/icons/spike_icon';
import blob_icon from '../assets/icons/blob_icon';
import sun_icon from '../assets/icons/sun_icon';
import handshake_icon from '../assets/icons/handshake_icon';

const interCodeToSVG ={
    0: {path: ''},
    1: {path: multistar_icon}, 
    2: {path: cross_icon}, 
    3: {path: cross_icon}, 
    4: {path: diamond_icon}, 
    5: {path: fence_icon},  
    6: {path: sun_icon},
    7: {path: spike_icon}, 
    8: {path: square_icon}, 
    9: {path: blob_icon}, 
    'mediation': {path: handshake_icon},
}

export default interCodeToSVG;