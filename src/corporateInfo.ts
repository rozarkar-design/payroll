/**
 * Official Corporate Registration & Legal Entity Data for Sugartown
 */

export interface CorporateEntityDetails {
  legalName: string;
  tradeName: string;
  cin: string;
  email: string;
  hrEmail: string;
  careersEmail: string;
  supportEmail: string;
  phone: string;
  registeredAddress: {
    building: string;
    officeNo: string;
    surveyNo: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    country: string;
    fullFormatted: string;
  };
}

export const SUGARTOWN_CORPORATE_INFO: CorporateEntityDetails = {
  legalName: 'SUGARTOWN RETAIL PRIVATE LIMITED',
  tradeName: 'Sugartown Artisan Confectionery & Retail',
  cin: 'U47215PN2025PTC243386',
  email: 'info@sugartown.in',
  hrEmail: 'admin@sugartown.in',
  careersEmail: 'career@sugartown.in',
  supportEmail: 'info@sugartown.in',
  phone: '+91 91454 48010',
  registeredAddress: {
    building: 'Workflo Icon Tower',
    officeNo: 'Office No. 702',
    surveyNo: 'Sr No. 114 /5 , 115 / 1 , 114 / 6 / 3',
    city: 'Pune City',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '411045',
    country: 'India',
    fullFormatted: 'Workflo Icon Tower, Office No. 702, Sr No. 114 /5 , 115 / 1 , 114 / 6 / 3, Pune City, Pune, Maharashtra, 411045 - India'
  }
};
