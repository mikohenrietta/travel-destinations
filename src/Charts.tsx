/*import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from "recharts";
interface Destination {
    name: string;
    country: string;
    description: string;
    address: string;
    picture: string;
    continent: string;
    rating: number;
}

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FE3"];

interface ChartsPageProps {
    destinations: Destination[];
}

const ChartsPage: React.FC<ChartsPageProps> = ({ destinations }) => {
    const [continentData, setContinentData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const continentCounts: Record<string, number> = destinations.reduce((acc, { continent }) => {
        acc[continent] = (acc[continent] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const formattedData = Object.entries(continentCounts).map(([key, value]) => ({
      name: key,
      value,
    }));

    setContinentData(formattedData);
  }, []);

  return (
    <div className="charts">
      <h1>Travel Destination Charts</h1>
      
      <div>
        <h2>Ratings of Destinations</h2>
        <BarChart width={500} height={300} data={destinations}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="rating" fill="#8884d8" />
        </BarChart>
      </div>

      <div>
        <h2>Destinations by Continent</h2>
        <PieChart width={400} height={300}>
          <Pie data={continentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {continentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>

      <div>
        <h2>Ratings Trend</h2>
        <LineChart width={500} height={300} data={destinations}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="rating" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
};

export default ChartsPage;
*/
