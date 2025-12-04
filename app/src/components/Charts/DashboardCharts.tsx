"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

interface DashboardChartsProps {
  monthlyLabels: string[];
  monthlyRevenue: number[];
  vendorCount: number[];
  productCount: number[];
}

export default function DashboardCharts({
  monthlyLabels,
  monthlyRevenue,
  vendorCount,
  productCount,
}: DashboardChartsProps) {
  const revenueData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Monthly Revenue (₹)",
        data: monthlyRevenue,
        backgroundColor: "#852BAF",
      },
    ],
  };

  const vendorProductData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Vendors",
        data: vendorCount,
        borderColor: "#FC3F78",
        tension: 0.4,
      },
      {
        label: "Products",
        data: productCount,
        borderColor: "#2ECC71",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

      {/* Revenue Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h3 className="font-semibold text-gray-900 mb-3">Monthly Revenue</h3>
        <Bar data={revenueData} height={200} />
      </div>

      {/* Vendor & Product Line Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <h3 className="font-semibold text-gray-900 mb-3">Vendor & Product Growth</h3>
        <Line data={vendorProductData} height={200} />
      </div>

    </div>
  );
}
