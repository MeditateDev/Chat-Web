import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { numberCodes } from "../../../utils/numberCodes";

const NumberCodeSelect = ({ setValue, register, data, errors }) => {
  const [searchCode, setSearchCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(numberCodes[0].code);
  const [filteredNumberCodes, setFilteredNumberCodes] = useState(numberCodes);
  useEffect(() => {
    setFilteredNumberCodes(
      () =>
        numberCodes.filter(({ flag, ...rest }) =>
          Object.values(rest).some((val) =>
            val.toLowerCase().includes(searchCode.toLowerCase())
          )
        ) || []
    );
  }, [searchCode]);

  useEffect(() => {
    if (data.defaultValue) {
      setValue(`${data.answerVariable}NumberCode`, data.defaultValue);
      setSelectedCountry(() => {
        if (numberCodes.findIndex((e) => e.number === data.defaultValue) !== -1)
          return numberCodes[
            numberCodes.findIndex((e) => e.number === data.defaultValue)
          ].code;
        else {
          return numberCodes[0].code;
        }
      });
    }
  }, []);

  return (
    <div>
      <Menu placement="bottom-start">
        <MenuHandler>
          <Button
            ripple={false}
            variant="text"
            color="blue-gray"
            className="flex h-10 items-center gap-2 rounded-r-none border border-blue-gray-200 pl-3"
          >
            <img
              src={
                numberCodes[
                  numberCodes.findIndex((e) => e.code === selectedCountry)
                ].flag
              }
              alt={
                numberCodes[
                  numberCodes.findIndex((e) => e.code === selectedCountry)
                ].name
              }
              className="h-4 w-4 rounded-full object-cover"
            />
            {
              numberCodes[
                numberCodes.findIndex((e) => e.code === selectedCountry)
              ].number
            }
          </Button>
        </MenuHandler>
        <MenuList className="max-h-[20rem] max-w-[18rem]">
          {[
            <div
              className="search-code__container shadow-sm"
              key="search"
              value="searching"
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchCode}
                className="px-1 py-2 outline-none border-b-2 w-full"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                autoFocus
                onChange={(e) => setSearchCode(e.target.value)}
              />
            </div>,
            ...(filteredNumberCodes.length > 0
              ? filteredNumberCodes.map((e, i) => {
                  return (
                    <MenuItem
                      key={e.name}
                      value={e.number}
                      className="flex items-center gap-2"
                      onClick={() => {
                        setSelectedCountry(e.code);
                        setValue(`${data.answerVariable}NumberCode`, e.number);
                      }}
                    >
                      <img
                        src={e.flag}
                        alt={e.name}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                      {e.name} <span className="ml-auto">{e.number}</span>
                    </MenuItem>
                  );
                })
              : [
                  <MenuItem disabled key={"no-result"}>
                    No Result...
                  </MenuItem>,
                ]),
          ]}
        </MenuList>
      </Menu>
    </div>
  );
};

export default NumberCodeSelect;
