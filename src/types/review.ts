export type ReviewVerdict =
  | 'APPROVED'
  | 'APPROVED_WITH_COMMENTS'
  | 'REQUEST_CHANGES'
  | 'CRITICAL_BLOCKER';

export type IssuePillar = 'bugs' | 'security' | 'performance' | 'architecture';

export type IssueSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NITPICK';

export interface ReviewIssue {
  id: string;
  pillar: IssuePillar;
  severity: IssueSeverity;
  title: string;
  description: string;
  line: string;
  reviewer: string;
  fixRecommendation: string;
  suggestedCode?: string;
}

export interface ReviewMetrics {
  correctness: number;
  security: number;
  performance: number;
  maintainability: number;
  testability: number;
}

export interface SeniorDevReview {
  personaTitle: string;
  summary: string;
  topStrengths?: string[];
  codeSmells: string[];
  idiomaticAdvice?: string;
  lineComments: Array<{
    line: string;
    severity: string;
    comment: string;
    suggestedChange?: string;
  }>;
}

export interface TestCaseItem {
  testCaseName: string;
  testType: string;
  input?: string;
  expectedResult: string;
}

export interface SeniorQaReview {
  personaTitle: string;
  summary: string;
  edgeCases: string[];
  failureScenarios: string[];
  testPlan: TestCaseItem[];
  testCodeSnippet: string;
}

export interface EngManagerReview {
  personaTitle: string;
  summary: string;
  architecturalRisks: string[];
  securityRisks: string[];
  scalabilityBottlenecks: string[];
  techDebtAssessment: string;
  rolloutRisks?: string[];
  recommendedAction: string;
}

export interface ReviewResponse {
  overallScore: number;
  verdict: ReviewVerdict;
  verdictReason: string;
  consensusSummary: string;
  metrics: ReviewMetrics;
  seniorDevReview: SeniorDevReview;
  qaReview: SeniorQaReview;
  engManagerReview: EngManagerReview;
  issues: ReviewIssue[];
  refactoredCode: string;
  refactorHighlights?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  persona: 'sse' | 'qa' | 'em' | 'panel';
  content: string;
  timestamp: string;
}
