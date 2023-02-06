import React, { useEffect, useState, createContext } from "react";
import TableContext from "../../context/TableContext";
import TableCom from "../../components/Table/Table";
import Topbar from "../../components/Topbar/Topbar";
import styles from "../../styles/table.module.scss";
import DropdownLocations from "../../components/DropdownSelector/DropdownLocations";
import { Tag } from "antd";

const TablePage = ({ promise }) => {
  const parsedData = JSON.parse(promise);

  const initialState = {
    key: parsedData[0].id,
    value: parsedData[0].apiKey,
    label: parsedData[0].name,
  };
  const [locationState, setLocationState] = useState(initialState);

  return (
    <TableContext.Provider value={{locationState, setLocationState, parsedData}}>
      <main className={styles.table_container}>
        <div className={styles.child_container}>
          <div className={styles.topbar_container}>
            <h1>Seguimiento de leads<Tag color={'red'} style={{marginLeft: 10, marginBottom: 10}}>BETA</Tag> </h1>
            <Topbar />
            <DropdownLocations/>
          </div>
          <TableCom  />
          {/* state={locationState} */}
        </div>
      </main>
    </TableContext.Provider>
  );
};

export const getServerSideProps = async ({ query: { table } }) => {
  const arr = table.split(",");

  var myHeaders = new Headers();
  const key = process.env.NEXT_PUBLIC_API_KEY;
  myHeaders.append("Authorization", `Bearer ${key}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const resultado = arr.map(async (item) => {
    const response = await fetch(
      `https://rest.gohighlevel.com/v1/locations/${item}`,
      requestOptions
    );

    return await response.json();
  });

  return {
    props: {
      promise: await Promise.all(resultado).then((data) => {
        const finalResponse = JSON.stringify(data);
        return finalResponse;
      }),
    },
  };
};
export default TablePage;
