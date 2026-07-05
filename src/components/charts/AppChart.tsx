import { JSX } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler, ChartTypeRegistry, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler, ArcElement);

export default function AppChart({ type, data, legendPosition = 'top', title, showTitle = true }: IAppChart): JSX.Element {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: legendPosition,
            },
            title: {
                display: showTitle,
                text: title,
            },
        },
    };

    switch (type) {
        case 'bar':
            return <AppBar data={data} options={options} />;
        case 'line':
            return <AppLine data={data} options={options} />;
        case 'doughnut':
            return <AppDoughnut data={data} options={options} />;
        case 'pie':
            return <AppPie data={data} options={options} />;
        default:
            return <AppBar data={data} options={options} />;
    }
}

function AppBar({ options, data }): JSX.Element {
    return <Bar options={options} data={data} />;
}

function AppLine({ options, data }): JSX.Element {
    return <Line options={options} data={data} />;
}

function AppDoughnut({ options, data }): JSX.Element {
    return <Doughnut options={options} data={data} />;
}

function AppPie({ options, data }): JSX.Element {
    return <Pie options={options} data={data} />;
}

interface IAppChart {
    type: keyof ChartTypeRegistry;
    showTitle?: boolean;
    title: string;
    legendPosition?: 'top' | 'bottom' | 'right' | 'left';
    data: AppChartType;
}

export type AppChartType = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string | string[];
        borderColor?: string | string[];
        borderWidth?: number;
    }[];
};
