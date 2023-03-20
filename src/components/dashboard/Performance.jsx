import { DonutChart, AreaChart } from "@tremor/react";

const cities = [
    {
        name: 'Forensics',
        percent: 11.11,
    },
    {
        name: 'Cryptography',
        percent: 11.11,
    },
    {
        name: 'Web',
        percent: 11.11,
    },
    {
        name: 'Reverse Engineering',
        percent: 11.11,
    },
    {
        name: 'Programming',
        percent: 11.11,
    },
    {
        name: 'Pwn',
        percent: 11.11,
    },
    {
        name: 'Steganography',
        percent: 11.11,
    },
    {
        name: 'Basic',
        percent: 11.11,
    },
    {
        name: 'Other',
        percent: 11.11,
    },

];

const chartdata = [
    {
        date: "Jan 22",
        SemiAnalysis: 2890,
        "Ray": 2338,
    },
    {
        date: "Feb 22",
        SemiAnalysis: 2756,
        "Ray": 2103,
    },
    {
        date: "Mar 22",
        SemiAnalysis: 3322,
        "Ray": 2194,
    },
    {
        date: "Apr 22",
        SemiAnalysis: 3470,
        "Ray": 2108,
    },
    {
        date: "May 22",
        SemiAnalysis: 3475,
        "Ray": 1812,
    },
    {
        date: "Jun 22",
        SemiAnalysis: 3129,
        "Ray": 1726,
    },
];


const valueFormatter = (number) => (

    `${Intl.NumberFormat('us').format(number).toString()}%`
);

const dataFormatter = (number) =>
    `${Intl.NumberFormat("us").format(number).toString()}`;



export function Performance() {
    return (
        <>
            <div className='hidden mt-10 mx-auto text-center flex justify-center gap-4 mb-14  rounded-lg'>

                <div className=' text-center w-1/2'>
                    <p className='text-white'> Skill Overview </p>
                    <DonutChart
                        height="h-60"
                        data={cities}
                        variant="pie"
                        category="percent"
                        dataKey="name"
                        valueFormatter={valueFormatter}
                        marginTop="mt-4"
                        colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
                        label="Skill Overview"
                        showLabel={true}
                    />
                </div>

                <div className=' text-center w-1/2 '>
                    <p className='text-white'> Points Earned </p>


                    <AreaChart
                        data={chartdata}
                        categories={["Laphatize", "Ray"]}
                        dataKey="date"
                        height="h-80"
                        colors={["indigo", "cyan"]}
                        valueFormatter={dataFormatter}
                        marginTop="mt-4"
                    />
                </div>

            </div>



        </>
    )
}
