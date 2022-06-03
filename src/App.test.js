//
// Copyright (c) Open Source Video Team and contributors. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
//

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
