import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function LayoutSwitch(props) {
  return (
    <TextField
      id="layout-options-selector"
      select
      label="Layout options"
      value={props.layoutAlgorithm || "force-directed"}
      onChange={(event) => {
        props.onLayoutChange(event.target.value);
      }}
      fullWidth
      margin="normal"
      InputLabelProps={{
        shrink: true,
      }}
      SelectProps={{
        IconComponent: ExpandMoreIcon,
        MenuProps: {
          PaperProps: {
            style: {
              padding: 0,
              margin: 0,
              overflow: "hidden",
            },
          },
        },
      }}
      className="layout-switch-container"
    >
      <MenuItem value="force-directed">Default graph visualisation</MenuItem>
      <MenuItem value="fruchterman-reingold">Fruchterman–Reingold</MenuItem>
      <MenuItem value="kamada-kawai">Kamada–Kawai</MenuItem>
      <MenuItem value="circle">Simple Circle</MenuItem>
    </TextField>
  );
}
