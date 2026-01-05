
import { NextResponse } from 'next/server';

export async function POST() {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock response as requested
    return NextResponse.json([
        {
          width: 148,
          height: 24,
          x: 509,
          y: 300,
          confidence: 0.99033522605896,
          class_id: 5,
          class: 'power_cable',
          detection_id: 'afde9877-aabe-421e-b33b-fa4f1ff53e2d',
          parent_id: 'image'
        },
        {
          width: 206,
          height: 88,
          x: 536,
          y: 352,
          confidence: 0.973871648311615,
          class_id: 0,
          class: 'antena',
          detection_id: '25f598b6-c007-4ead-bcad-68fb01a107a0',
          parent_id: 'image'
        }
    ]);
}
