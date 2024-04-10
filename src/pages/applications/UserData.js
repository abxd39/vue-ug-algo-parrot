export const operationTyps = [
  {label: '=', value: 1}, {label: '!=', value: 2}, {label: '>', value: 3},
  {label: '>=', value: 4}, {label: '<', value: 5}, {label: '<=', value: 6},
  {label: 'in', value: 7}, {label: 'not in', value: 8}
];

export function getValueOfType(value) {
  for (let i = 0; i < operationTyps.length; i++) {
    if (operationTyps[i].value === value) {
      return operationTyps[i].label
    }
  }
  return ''
};