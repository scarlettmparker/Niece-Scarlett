export interface LanguageTransferFaqBullet {
  label: string;
  url: string;
}

export interface LanguageTransferFaq {
  title?: string;
  intro?: string;
  bulletsHeader?: string;
  bullets?: LanguageTransferFaqBullet[];
  resourcesChannel?: string;
  outro?: {
    blurb?: string;
    resources?: string;
    resourcesLink?: string;
    resourcesContinued?: string;
  };
  footer?: string;
}
