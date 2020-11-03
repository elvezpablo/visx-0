import React from 'react';
import { letterFrequency } from '@visx/mock-data';
import { Group } from '@visx/group';
import { GradientTealBlue } from '@visx/gradient';
import { Bar } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';

// We'll use some mock data from `@visx/mock-data` for this.
const data = letterFrequency;

// Define the graph dimensions and margins
const width = 500;
const height = 500;
const margin = { top: 20, bottom: 20, left: 0, right: 0 };

// Then we'll create some bounds
const xMax = width - margin.left - margin.right;
const yMax = height - margin.top - margin.bottom;

// We'll make some helpers to get at the data we want
const x = d => d.letter;
const y = d => +d.frequency * 100;

// And then scale the graph by our data
const xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: data.map(x),
    paddingInner: 0.4,
    paddingOuter: 1
});
const yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, Math.max(...data.map(y))],
});

// Compose together the scale and accessor functions to get point functions
const compose = (scale, accessor) => data => scale(accessor(data));
const xPoint = compose(xScale, x);
const yPoint = compose(yScale, y);

// Finally we'll embed it all in an SVG
function BarGraph(props) {
    return (
        <svg width={width} height={height}>
            <GradientTealBlue id="teal" />
            <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={`url(#teal)`}
                rx={14}
            />
            {data.map((d, i) => {
                const barHeight = yMax - yPoint(d);
                return (
                    <Group key={`bar-${i}`}>
                        <Bar
                            x={xPoint(d) + margin.left}
                            y={yMax - barHeight + margin.top}
                            height={barHeight}
                            width={xScale.bandwidth()}
                            fill="rgba(255,255,255, .4)"
                        />
                    </Group>
                );
            })}
        </svg>
    );
}

export default BarGraph;