import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function WpmChart({ wpmHistory }) {
  return (
    <div className="w-full h-[250px] md:h-[300px] mb-12 px-4 md:px-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={wpmHistory}>
          <XAxis dataKey="time" stroke="var(--sub-color)" tick={{fill: 'var(--sub-color)', fontSize: 12}} axisLine={false} tickLine={false} />
          <YAxis stroke="var(--sub-color)" tick={{fill: 'var(--sub-color)', fontSize: 12}} domain={[0, 'dataMax + 20']} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--main-color)', borderRadius: '8px', color: 'var(--text-color)' }}
            itemStyle={{ color: 'var(--main-color)' }}
          />
          <Line type="monotone" dataKey="wpm" stroke="var(--main-color)" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}