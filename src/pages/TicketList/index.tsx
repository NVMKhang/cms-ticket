import { Table } from "antd";
import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTickets } from "../../api/crudData";
import { DateTime } from "../../components/Calendar";
import Pagination from "../../components/Pagination";
import TableList, { DataTable } from "../../components/TableList";
import { TicketListData } from "../../models/Ticket";
import { search } from "../../slice/Filter/filterSlice";
import {
  loadTicketList,
  requestUpdateStatus,
  updateDate,
} from "../../slice/LoadData/loadTicketList";
import {
  displayAddModal,
  displayChangeDateModal,
  displayFilterModal,
} from "../../slice/ModalSlice";
import { RootState } from "../../store";
import { formatDate } from "../../utils/dateTime";
import { exportCSV, FormatKey } from "../../utils/exportCSV";
import { filter } from "../../utils/filter";
import { search as searchList } from "../../utils/filter";
interface Props {}

export const LoadingContext = createContext(false);

const TicketList = (props: Props) => {
  const dispatch = useDispatch();
  const filterParams = useSelector((state: RootState) => state.filter.filter);
  const searchKey = useSelector((state: RootState) => state.filter.search);
  const ticketsFromStore = useSelector(
    (state: RootState) => state.tickets.list
  );
  const [ticketList, setTicketList] = useState<TicketListData[]>([]);
  const [displayTooltip, setDisplayTooltip] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [keySearch, setKeySearch] = useState<string>("");

  const handleDisplayTooltip = (index: number) => {
    setDisplayTooltip(index);
  };

  const handleUpdateTicket = (item: TicketListData) => {
    dispatch(requestUpdateStatus(item));
    setTimeout(() => {
      setDisplayTooltip(-1);
    }, 100);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text: string, record: TicketListData) =>
        ticketList.indexOf(record) + 1,
    },
    {
      title: "Booking code",
      dataIndex: "bookingCode",
      key: "bookingCode",
    },
    {
      title: "S??? v??",
      dataIndex: "ticketNumber",
      key: "ticketNumber",
    },
    {
      title: "T??n s??? ki???n",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "T??nh tr???ng s??? d???ng",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (
        <p
          className={`tb__status ${
            status === 0
              ? "tb__status--used"
              : status === 1
              ? "tb__status--unused"
              : "tb__status--expire"
          }`}
        >
          <span></span>
          {status === 0
            ? "???? s??? d???ng"
            : status === 1
            ? "Ch??a s??? d???ng"
            : "H???t h???n"}
        </p>
      ),
    },
    {
      title: "Ng??y s??? d???ng",
      dataIndex: "usingDate",
      key: "usingDate",
      render: (date: DateTime) => <>{formatDate(date)}</>,
    },
    {
      title: "Ng??y Xu???t v??",
      dataIndex: "exportDate",
      key: "exportDate",
      render: (date: DateTime) => <>{formatDate(date)}</>,
    },
    {
      title: "C???ng check-in",
      dataIndex: "checkInPort",
      key: "checkInPort",
      render: (port: number) => "C???ng " + port,
    },
    {
      options: "",
      dataIndex: "options",
      key: "options",
      render: (text: string, record: TicketListData) => (
        <div
          className="tickets__options__tooltip"
          onClick={(e) => {
            e.stopPropagation();
            handleDisplayTooltip(ticketList.indexOf(record));
          }}
        >
          {record.status === 1 && (
            <>
              <i className="bx bx-dots-vertical-rounded tickets__options"></i>

              <div
                className={`item__tooltip ${
                  displayTooltip === ticketList.indexOf(record) ? "display" : ""
                }`}
              >
                <li onClick={() => handleUpdateTicket(record)}>S??? d???ng v??</li>
                <li
                  onClick={() => {
                    dispatch(displayChangeDateModal(record));
                    setTimeout(() => {
                      setDisplayTooltip(-1);
                    }, 200);
                  }}
                >
                  ?????i ng??y s??? d???ng
                </li>
                <div className="triangle"></div>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllTickets()
      .then((res) => {
        dispatch(loadTicketList(res));
      })
      .catch((e) => {
        console.log(e);
      });
  }, [filterParams, keySearch]);

  useEffect(() => {
    const list = searchList(keySearch, filter(filterParams, ticketsFromStore));
    setTicketList(list);
  }, [ticketsFromStore]);

  const handleDownloadCSVFile = () => {
    const mapKey: FormatKey<TicketListData> = {
      bookingCode: "Booking code",
      checkInPort: "C???ng check-in",
      checkStatus: "Tr???ng th??i ?????i so??t",
      exportDate: "Ng??y h???t h???n",
      name: "T??n s??? ki???n",
      status: "T??nh tr???ng s??? d???ng",
      ticketNumber: "S??? v??",
      typeName: "T??n lo???i v??",
      usingDate: "Ng??y s??? d???ng",
    };
    exportCSV(
      {
        mapKey,
        list: ticketList,
      },
      "export.csv",
      "export-csv"
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeySearch(e.target.value);
    dispatch(search(e.target.value));
  };

  return (
    <LoadingContext.Provider value={isLoading}>
      <div className="content__main">
        <div className="ticket__list">
          <p className="ticket__list__title title">Danh s??ch v??</p>
          <div className="ticket__features">
            <div className="header__search ticket__list__search">
              <input
                type="number"
                placeholder="T??m b???ng s??? v??"
                value={keySearch}
                onChange={handleSearch}
              />
              <img src="./imgs/search.svg" alt="" />
            </div>
            <div className="ticket__list__action">
              <button
                onClick={() => dispatch(displayFilterModal())}
                className="button"
              >
                <i className="bx bx-filter-alt"></i>L???c
              </button>
              <button onClick={handleDownloadCSVFile} className="button">
                <a id="export-csv">Xu???t file (.csv)</a>
              </button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={ticketList}
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: false,
              pageSizeOptions: ["10", "20", "30"],
            }}
            className="ticket__list__table"
          />
        </div>
      </div>
    </LoadingContext.Provider>
  );
};

export default TicketList;
