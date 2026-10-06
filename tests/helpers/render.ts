import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM, type DOMWindow } from 'jsdom';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

type Props = Record<string, unknown>;
type Slots = Record<string, string>;

export async function renderHtml(component: AstroComponentFactory, props: Props = {}, slots: Slots = {}): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(component, { props, slots });
}

export async function renderWindow(component: AstroComponentFactory, props: Props = {}, slots: Slots = {}): Promise<DOMWindow> {
  return new JSDOM(await renderHtml(component, props, slots)).window;
}

export async function renderDoc(component: AstroComponentFactory, props: Props = {}, slots: Slots = {}): Promise<Document> {
  return (await renderWindow(component, props, slots)).document as unknown as Document;
}
