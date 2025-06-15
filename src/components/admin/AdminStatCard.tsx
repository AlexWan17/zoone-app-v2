
import React from "react";

type Props = {
  title: string;
  value: number | string;
  hint?: string;
  className?: string;
};

const AdminStatCard = ({ title, value, hint, className }: Props) => (
  <div className={`bg-white rounded-md shadow p-6 flex flex-col justify-between ${className}`}>
    <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">{title}</span>
    <span className="text-2xl font-bold mt-2 mb-1">{value}</span>
    {hint && <span className="text-xs text-gray-500">{hint}</span>}
  </div>
);

export default AdminStatCard;
