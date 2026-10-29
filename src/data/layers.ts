import type { Layer, LayerId } from './types';

/** Bottom to top. `color` is the fill (--c), `text` the label on it (--t). */
export const layers: Layer[] = [
  { id: 'hardware', name: 'Hardware', color: '#1E7A50', text: '#E9FFF3', tech: ['ESP32', 'Raspberry Pi', 'sensors'] },
  { id: 'firmware', name: 'Firmware', color: '#2A2F3A', text: '#E7EAF0', tech: ['C++', 'WebSerial'] },
  { id: 'services', name: 'Services', color: '#2B59FF', text: '#F0F3FF', tech: ['Go', 'NATS', 'FastAPI', 'Lambda'] },
  { id: 'data', name: 'Data', color: '#FF7A1A', text: '#1E0D00', tech: ['DynamoDB', 'PostgreSQL', 'BigQuery'] },
  { id: 'product', name: 'Product', color: '#DFFF4F', text: '#141600', tech: ['Dashboards', 'Slack bot'] },
];

export function layerById(id: LayerId): Layer {
  const layer = layers.find(l => l.id === id);
  if (!layer) throw new Error(`Unknown layer: ${id}`);
  return layer;
}
