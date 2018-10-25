import { expect, test } from '@salesforce/command/dist/test';

describe('metadata:profiles:split', () => {
  test
    .stdout()
    .command(['metadata:profiles:split', '--input', '../../data/profiles', '--output', '../../data/converted'])
    .it('runs metadata:profiles:split --input=../../data/profiles --output=../../data/converted', ctx => {
        expect(ctx.stdout).to.not.contain('Error');
    });
});