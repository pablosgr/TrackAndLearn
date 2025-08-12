export type LLMTestResponseType = {
  test_template_name: string;
  tests: Test[];
};

export type Test = {
  name: string;
  time_limit: number;
  questions: Question[];
};

export type Question = {
  question_text: string;
  options_number: number;
  options: Option[];
  index_order: number;
};

export type Option = {
  option_text: string;
  is_correct: boolean;
  index_order: number;
};
