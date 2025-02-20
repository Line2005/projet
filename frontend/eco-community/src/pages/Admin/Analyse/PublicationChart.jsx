import React, { useEffect } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import {FileText, Calendar} from 'lucide-react'
import {Card, CardContent, CardHeader, CardTitle} from "../../../components/ui/card.jsx";

const PublicationsCard = ({ data }) => {
    const isValidData = Array.isArray(data) && data.length > 0;

    const processedData = isValidData ? data.map(item => ({
        month: item.month || '',
        announcements: Number(item.announcements || 0),
        events: Number(item.events || 0),
        total: Number(item.total || 0)
    })) : [];

    // Calculate total publications
    const totals = isValidData ? processedData.reduce((acc, curr) => ({
        announcements: acc.announcements + curr.announcements,
        events: acc.events + curr.events
    }), { announcements: 0, events: 0 }) : { announcements: 0, events: 0 };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-900">{label}</p>
                    {payload.map((item, index) => (
                        <p key={index} className="text-sm" style={{ color: item.color }}>
                            {`${item.name}: ${item.value}`}
                        </p>
                    ))}
                    {payload[0] && payload[1] && (
                        <p className="text-sm text-gray-600 mt-1 font-medium">
                            Total: {payload[0].value + payload[1].value}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Publications et Événements</CardTitle>
                {isValidData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Annonces</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        {totals.announcements}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <Calendar className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Événements</p>
                                    <p className="text-xl font-bold text-green-600">
                                        {totals.events}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    {!isValidData ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <p className="text-lg font-medium mb-2">Aucune donnée disponible</p>
                            <p className="text-sm">Les statistiques apparaîtront ici une fois disponibles</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={processedData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorAnnouncements" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                    dataKey="month"
                                    className="text-gray-600"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={{ stroke: '#E5E7EB' }}
                                />
                                <YAxis
                                    className="text-gray-600"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={{ stroke: '#E5E7EB' }}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    wrapperStyle={{
                                        paddingTop: '8px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="announcements"
                                    name="Annonces"
                                    stroke="#4f46e5"
                                    fill="url(#colorAnnouncements)"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="events"
                                    name="Événements"
                                    stroke="#10b981"
                                    fill="url(#colorEvents)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default PublicationsCard;