export const DATE_FILTER_ERRORS = {
  END_DATE_BEFORE_START: 'Data fim deve ser posterior à data início',
  INVALID_DATE_RANGE: 'Intervalo de datas inválido',
  MAX_RANGE_EXCEEDED: 'Intervalo máximo permitido é de 1 ano',
  INVALID_DATE_FORMAT: 'Formato de data inválido'
} as const;

export const FILTER_MESSAGES = {
  NO_RESULTS: 'Nenhuma transação encontrada para os filtros aplicados',
  LOADING: 'Carregando transações...',
  ERROR: 'Erro ao carregar transações'
} as const;