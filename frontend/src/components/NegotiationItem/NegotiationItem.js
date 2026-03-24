import "./NegotiationItem.scss";
import React from "react";
//External Library
import { useTable, useExpanded, useSortBy } from "react-table";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
//MUI
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
//Helper
import { getAgreementText, getDateString } from "../../helper/formatUtils";
import useDeviceCheck from '../../hooks/useDeviceCheck';

import styles from "../../styles/global.scss";

const ExpandableTable = ({ peaceData, columns }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: peaceData || [] }, useSortBy, useExpanded);

    const { isMobile } = useDeviceCheck();

  return (
    <Box className={`${isMobile ? "mob-landview ": ""}table-container`}>
      <table {...getTableProps()} className="dyad-table-wrapper">
        <thead
          style={{ position: "sticky", top: 0, zIndex: 1 }}
          className="dyad-table-header-wrapper "
        >
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(
                    column.getSortByToggleProps({ title: undefined })

                  )}
                  className="tableHead"
                >
                  <Stack
                    direction="row"
                    sx={{ alignItems: "center", gap: "8px" }}
                  >
                    {column.render("Header")}
                    {["ID", "Start", "End"].includes(column.Header) && (
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <IoIosArrowUp
                          size={12}
                          style={{
                            opacity:
                              column.isSorted && !column.isSortedDesc ? 1 : 0.5,
                            color:
                              column.isSorted && !column.isSortedDesc
                                ? "blue"
                                : "gray",
                          }}
                        />
                        <IoIosArrowDown
                          size={12}
                          style={{
                            opacity:
                              column.isSorted && column.isSortedDesc ? 1 : 0.5,
                            color:
                              column.isSorted && column.isSortedDesc
                                ? "blue"
                                : "gray",
                          }}
                        />
                      </Box>
                    )}
                  </Stack>
                </th>
              ))}
              <th
               
              ></th>
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <React.Fragment key={row.id}>
                <tr
                  {...row.getRowProps()}
                  onClick={() => row.toggleRowExpanded()}
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                     
                    >
                      <Typography
                        color={styles.textMedium}
                        fontSize={styles.fontText}
                        fontWeight="500"
                      >
                        {cell.render("Cell")}
                      </Typography>
                    </td>
                  ))}
                  <td
                    style={{
                      padding: "18px 20px 17px 10px",
                      borderTop: "1px solid #f3f3f3",
                      cursor: "pointer",
                    }}
                  >
                    {row.isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </td>
                </tr>
                {row.isExpanded && (
                  <tr className="tableRow">
                    <td colSpan={7} style={{ padding: "20px" }}>
                      <Typography
                        color={styles.extraDarkBlue}
                        fontSize={styles.fontXsMedium}
                        fontWeight="600"
                        sx={{
                          display: { xs: "block", sm: "none", md: "none" },
                          marginBottom: "5px",
                        }}
                      >
                        {" "}
                        ID{" "}
                      </Typography>

                      <Typography
                        color={styles.extraDarkBlue}
                        fontSize={styles.fontXsMedium}
                        sx={{
                          display: { xs: "block", sm: "none", md: "none" },
                          marginBottom: "10px",
                        }}
                      >
                        {row.original.negotiation_id || "--"}
                      </Typography>
                      <Typography
                        color={styles.extraDarkBlue}
                        fontSize={styles.fontXsMedium}
                        fontWeight="600"
                        sx={{
                          display: { xs: "block", sm: "none", md: "none" },
                          marginBottom: "5px",
                        }}
                      >
                        Start
                      </Typography>
                      <Typography
                        color={styles.extraDarkBlue}
                        fontSize={styles.fontXsMedium}
                        sx={{
                          display: { xs: "block", sm: "none", md: "none" },
                          marginBottom: "10px",
                        }}
                      >
                        
                        {getDateString(
                   
                          row.original.start_year, row.original.start_month, row.original.start_day, row.original.precision_date
                        )}


                      </Typography>

                      <Typography
                        color={styles.extraDarkBlue}
                        fontSize={styles.fontXsMedium}
                        fontWeight="600"
                        sx={{
                          display: { xs: "block", sm: "none", md: "none" },
                          marginBottom: "5px",
                        }}
                      >
                        End
                      </Typography>
                      <Typography
                        color={styles.extraDarkBlue}
                        fontSize={styles.fontXsMedium}
                        sx={{
                          display: { xs: "block", sm: "none", md: "none" },
                          marginBottom: "10px",
                        }}
                      >
                  
{getDateString(
row.original.end_year, row.original.end_month, row.original.end_day, row.original.precision_date
)}

                      </Typography>

                      <Typography
                        color={styles.extraDarkBlue}
                        fontSize={styles.fontXsMedium}
                        fontWeight="600"
                        sx={{
                          display: { xs: "block", sm: "none", md: "none" },
                          marginBottom: "5px",
                        }}
                      >
                        Location of negotiations
                      </Typography>
                      <Typography
                        color={styles.extraDarkBlue}
                        fontSize={styles.fontXsMedium}
                        sx={{
                          display: { xs: "block", sm: "none", md: "none" },
                          marginBottom: "10px",
                        }}
                      >
                        {row.original?.city || "----"},{" "}
                        {row.original?.town_name || "----"}
                      </Typography>

                      <Typography
                        color={styles.extraDarkBlue}
                        fontSize={styles.fontXsMedium}
                        fontWeight="600"
                        sx={{
                          display: { xs: "block", sm: "none", md: "none" },
                          marginBottom: "5px",
                        }}
                      >
                        Meditation
                      </Typography>
                      <Typography
                        color={styles.extraDarkBlue}
                        fontSize={styles.fontXsMedium}
                        sx={{
                          display: { xs: "block", sm: "none", md: "none" },
                          marginBottom: "10px",
                        }}
                      >
                        {row.original.mediated_negotiations ? "Yes" : "No"}
                      </Typography>

                      <Typography
                        color={styles.extraDarkBlue}
                        fontSize={styles.fontXsMedium}
                        fontWeight="600"
                        sx={{
                          display: { xs: "block", sm: "none", md: "none" },
                          marginBottom: "5px",
                        }}
                      >
                        Agreement type
                      </Typography>
                      <Typography
                        color={styles.extraDarkBlue}
                        fontSize={styles.fontXsMedium}
                        sx={{
                          display: { xs: "block", sm: "none", md: "none" },
                          marginBottom: "10px",
                        }}
                      >
                        {getAgreementText(row.original)}
                      </Typography>

                      {row.original.third_party.length > 0 ? (
                        <Typography
                          fontWeight="600"
                          pb={0}
                          fontSize={styles.fontXsMedium}
                          color={styles.extraDarkBlue}
                          sx={{ marginBottom: "5px" }}
                        >
                          {"Third Party: " + row.original.third_party}
                        </Typography>
                      ) : null}
                      {row.original?.description && (
                        <Typography
                          fontSize={styles.fontXsMedium}
                          color={styles.extraDarkBlue}
                        >
                          {row.original.description}
                        </Typography>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
};

export default ExpandableTable;

