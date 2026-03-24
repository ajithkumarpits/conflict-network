import './TypeIcon.scss';
// MUI components
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
// icon components
import { ReactComponent as CrossIcon } from '../../assets/icons/cross_icon.svg';
import { ReactComponent as DiamondIcon } from '../../assets/icons/diamond_icon.svg';
import { ReactComponent as FenceIcon } from '../../assets/icons/fence_icon.svg';
import { ReactComponent as MultistarIcon } from '../../assets/icons/multistar_icon.svg';
// utils
import interCodeMapping from '../../utils/interCodeMapping';
 
export default function TypeIcon(props) {
 
    return (
        <div className='type-icon-wrap'>
            <Tooltip title={interCodeMapping[props.type]}>
                <SvgIcon
                className='type-icon-svg'
                style={{width: props.dim, height: props.dim}}
                >
                    {(props.type === 1)?
                        <MultistarIcon className='type-icon' style={{color: props.color}}/>:null
                    }
                    {(props.type === 2)?
                        <DiamondIcon className='type-icon' style={{color: props.color}}/>:null
                    }
                    {(props.type === 3)?
                        <CrossIcon className='type-icon' style={{color: props.color}}/>:null
                    }
                    {(props.type === 4)?
                       <FenceIcon className='type-icon' style={{color: props.color}}/>:null
                    }
                </SvgIcon>
            </Tooltip>
        </div>
    );
  }