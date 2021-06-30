/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

import * as React from 'react';
import {
  ControlElement,
  getData,
  HorizontalLayout,
  JsonSchema,
  update
} from '@jsonforms/core';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import BooleanCell, { booleanCellTester } from '../../src/cells/BooleanCell';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import { initJsonFormsVanillaStore } from '../vanillaStore';
import { vanillaRenderers } from '../../src';
import { InputControl } from '../../src/controls/InputControl';

Enzyme.configure({ adapter: new Adapter() });

const control: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

const fixture = {
  data: { foo: true },
  schema: { type: 'boolean' },
  uischema: control,
  styles: [
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ]
};

describe('Boolean cell tester', () => {
  test('tester', () => {
    expect(booleanCellTester(undefined, undefined)).toBe(-1);
    expect(booleanCellTester(null, undefined)).toBe(-1);
    expect(booleanCellTester({ type: 'Foo' }, undefined)).toBe(-1);
    expect(booleanCellTester({ type: 'Control' }, undefined)).toBe(-1);
  });

  test('tester with wrong prop type', () => {
    const controlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      booleanCellTester(controlElement, {
        type: 'object',
        properties: { foo: { type: 'string' } }
      }),
    ).toBe(-1);
  });

  test('tester with wrong prop type, but sibling has correct one', () => {
    const controlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      booleanCellTester(controlElement, {
        type: 'object',
        properties: {
          foo: {
            type: 'string'
          },
          bar: {
            type: 'boolean'
          }
        }
      })
    ).toBe(-1);
  });

  test('tester with matching prop type', () => {
    const controlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    expect(
      booleanCellTester(controlElement, {
        type: 'object',
        properties: {
          foo: {
            type: 'boolean'
          }
        }
      })
    ).toBe(2);
  });

});

describe('Boolean cell', () => {

  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test.skip('autofocus on first element', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        firstBooleanCell: { type: 'boolean' },
        secondBooleanCell: { type: 'boolean' }
      }
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstBooleanCell',
      options: {
        focus: true
      }
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/secondBooleanCell',
      options: {
        focus: true
      }
    };
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [firstControlElement, secondControlElement]
    };
    const data = {
      firstBooleanCell: true,
      secondBooleanCell: false
    };
    const store = initJsonFormsVanillaStore({
      data,
      schema,
      uischema,
      renderers: vanillaRenderers
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <HorizontalLayoutRenderer schema={schema} uischema={uischema} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const inputs = wrapper.find(InputControl);
    expect(inputs.at(0).is(':focus')).toBe(false);
    expect(inputs.at(1).is(':focus')).toBe(true);
  });

  test('autofocus active', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: true
      }
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={fixture.schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input');
    expect(input.is(':focus')).toBe(true);
  });

  test('autofocus inactive', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: false
      }
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={fixture.schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('autofocus inactive by default', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={fixture.schema} uischema={uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode();
    expect(document.activeElement).not.toBe(input);
  });

  test('render', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );

    const div = wrapper.find('.rs-checkbox').getDOMNode() as HTMLDivElement;
    expect(div.classList.toString()).toBe("rs-checkbox rs-checkbox-checked");

  });




  test('update via action', () => {
    const data = { foo: false };
    const store = initJsonFormsVanillaStore({
      data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );

    const div = wrapper.find('.rs-checkbox').getDOMNode() as HTMLDivElement;

    store.dispatch(update('foo', () => false));
    expect(div.classList.toString()).toBe("rs-checkbox");
    expect(getData(store.getState()).foo).toBe(false);
  });

  test('update with undefined value', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );

    const div = wrapper.find('.rs-checkbox').getDOMNode() as HTMLDivElement;

    store.dispatch(update('foo', () => undefined));
    expect(div.classList.toString()).toBe("rs-checkbox");
    expect(getData(store.getState()).foo).toBe(undefined);
  });

  test('update with null value', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const div = wrapper.find('.rs-checkbox').getDOMNode() as HTMLDivElement;

    store.dispatch(update('foo', () => null));
    expect(div.classList.toString()).toBe("rs-checkbox");
    expect(getData(store.getState()).foo).toBe(null);
  });

  test('update with wrong ref', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const div = wrapper.find('.rs-checkbox').getDOMNode() as HTMLDivElement;
    store.dispatch(update('bar', () => 11));
    expect(div.classList.toString()).toBe("rs-checkbox rs-checkbox-checked");
  });

  test('update with null ref', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const div = wrapper.find('.rs-checkbox').getDOMNode() as HTMLDivElement;
    store.dispatch(update(null, () => false));
    expect(div.classList.toString()).toBe("rs-checkbox rs-checkbox-checked");
  });

  test('update with undefined ref', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={fixture.schema} uischema={fixture.uischema} path='foo' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const div = wrapper.find('.rs-checkbox').getDOMNode() as HTMLDivElement;
    store.dispatch(update(undefined, () => false));
    expect(div.classList.toString()).toBe("rs-checkbox rs-checkbox-checked");
  });

  test('disable', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <BooleanCell schema={fixture.schema} uischema={fixture.uischema} enabled={false} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const div = wrapper.find('.rs-checkbox').getDOMNode() as HTMLDivElement;
    expect(div.classList.toString()).toBe("rs-checkbox rs-checkbox-disabled rs-checkbox-checked");
  });

});