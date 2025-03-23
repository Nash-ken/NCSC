import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BarChartComponent from "./charts/barchart";
import LineChartComponent from "./charts/linechart";
import PieChartComponent from "./charts/piechart";


interface StatisticProps {
  chartComponent: 'line' | 'bar' | 'pie'; // Expecting a string here for the type of chart
}

const Statistic: React.FC<StatisticProps> = ({ chartComponent }) => {
  return (
       <>
        {chartComponent === "line" && <LineChartComponent />}
        {chartComponent === "bar" && <BarChartComponent  />}
        {chartComponent === "pie" && <PieChartComponent />}
       </>
       
    
  );
};

export default Statistic;
