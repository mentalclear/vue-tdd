import { render } from '@testing-library/vue';
import TheInput from './TheInput.vue';

it('Has "is-invalid" class for input when help is set', () => {
  const { container } = render(TheInput, {
    props: {
      help: 'Error message',
    },
  });
  const input = container.querySelector('input');
  expect(input.classList).toContain('is-invalid');
});
it('Has "invalid-feedback" class for input when help is set', () => {
  const { container } = render(TheInput, {
    props: {
      help: 'Error message',
    },
  });
  const span = container.querySelector('span');
  expect(span.classList).toContain('invalid-feedback');
});
it('Doesn\'t have "is-invalid" class for input when help is NOT set', () => {
  const { container } = render(TheInput);
  const input = container.querySelector('input');
  expect(input.classList).not.toContain('is-invalid');
});
