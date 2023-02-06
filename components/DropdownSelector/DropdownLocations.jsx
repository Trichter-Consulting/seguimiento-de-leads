import { Select } from "antd";
import { useContext } from "react";
import TableContext from "../../context/TableContext";


const DropdownLocations = () => {
  
  
  const context = useContext(TableContext);
  const parsedData = context.parsedData;
  
  const handleChange = (value) => {
    context.setLocationState(value)
     // { value: "lucy", key: "lucy", label: "Lucy (101)" }
  };

  const options = parsedData.map((item) => {
    return {
      key: item.id,
      value: item.apiKey,
      label: item.name
    }
  })

  return (
    <Select
      labelInValue
      defaultValue={options[0]}
      style={{
        width: 220,
        marginLeft: 15,
      }}
      onChange={handleChange}
      options={options}
    >
    </Select>
  );
};

export default DropdownLocations;
