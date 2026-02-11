import { ColumnType } from "antd/lib/table";
import { UserModel } from "../Models";
import { userModel } from "components/Models/userModel";
import { getFormattedUtcDate } from "Common/utils";

interface CustomColumnType<T> extends ColumnType<T> {
  hidden?: boolean;
  order?: number;
  hasPermission?: boolean;
}

const UserColumns = (): CustomColumnType<UserModel>[] => {
  const columns: CustomColumnType<UserModel>[] = [
    {
      title: "Id",
      align: "center",
      dataIndex: "id",
      width: 120,
    },
    {
      title: "FirstName",
      align: "center",
      dataIndex: "firstName",
      width: 120,
    },
    {
      title: "LastName",
      align: "center",
      dataIndex: "lastName",
      width: 120,
    },
    {
      title: "UserName",
      align: "center",
      dataIndex: "userName",
      width: 120,
    },

    {
      title: "Email",
      align: "center",
      dataIndex: "email",
      width: 170,
    },
    {
      title: "Password",
      align: "center",
      dataIndex: "passwordHash",
      width: 120,
    },
    {
      key: "createdBy",
      title: "Created By",
      align: "center",
      width: 120,
      dataIndex: "createdBy",
    },
    {
      key: "createdDate",
      title: "Created Date",
      align: "center",
      width: 120,
      render: (text, row: userModel) => getFormattedUtcDate(row.createdDate),
    },

    {
      key: "modifiedBy",
      title: "Modified By",
      align: "center",
      width: 120,
      dataIndex: "modifiedBy",
    },

    {
      key: "modifiedDate",
      title: "Modified Date",
      align: "center",
      width: 120,
      render: (text, row: userModel) => getFormattedUtcDate(row.modifiedDate),
    },
  ];

  return columns;
};

export default UserColumns;
