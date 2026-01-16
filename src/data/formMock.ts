import type { FormStep } from '../types/form'

export const formSteps: FormStep[] = [
  {
    id: 'profile',
    titleKey: 'steps.profile',
    elements: [
      {
        id: 'fullName',
        type: 'text',
        name: 'fullName',
        labelKey: 'fields.fullName',
        placeholderKey: 'fields.fullNamePlaceholder',
      },
      {
        id: 'nationalId',
        type: 'id',
        name: 'nationalId',
        labelKey: 'fields.nationalId',
        placeholderKey: 'fields.nationalIdPlaceholder',
        pattern: '\\d{3}-\\d{4}-\\d{7}-\\d',
        inputMode: 'numeric',
      },
      {
        id: 'dateOfBirth',
        type: 'date',
        name: 'dateOfBirth',
        labelKey: 'fields.dateOfBirth',
      },
      {
        id: 'gender',
        type: 'radio',
        name: 'gender',
        labelKey: 'fields.gender',
        options: [
          { value: 'female', labelKey: 'fields.genderFemale' },
          { value: 'male', labelKey: 'fields.genderMale' },
          { value: 'other', labelKey: 'fields.genderOther' },
        ],
      },
      {
        id: 'address',
        type: 'text',
        name: 'address',
        labelKey: 'fields.address',
        placeholderKey: 'fields.addressPlaceholder',
      },
      {
        id: 'city',
        type: 'text',
        name: 'city',
        labelKey: 'fields.city',
      },
      {
        id: 'country',
        type: 'dropdown',
        name: 'country',
        labelKey: 'fields.country',
        options: [
          { value: '', labelKey: 'fields.countryPlaceholder' },
          { value: 'us', labelKey: 'fields.countryUS' },
          { value: 'sa', labelKey: 'fields.countrySA' },
          { value: 'eg', labelKey: 'fields.countryEG' },
        ],
      },
      {
        id: 'state',
        type: 'dropdown',
        name: 'state',
        labelKey: 'fields.state',
        options: [
          { value: '', labelKey: 'fields.statePlaceholder' },
          { value: 'ca', labelKey: 'fields.stateCA' },
          { value: 'ny', labelKey: 'fields.stateNY' },
          { value: 'riyadh', labelKey: 'fields.stateRiyadh' },
          { value: 'cairo', labelKey: 'fields.stateCairo' },
        ],
      },
      {
        id: 'phone',
        type: 'phone',
        name: 'phone',
        labelKey: 'fields.phone',
        placeholderKey: 'fields.phonePlaceholder',
        inputMode: 'tel',
      },
      {
        id: 'email',
        type: 'email',
        name: 'email',
        labelKey: 'fields.email',
        placeholderKey: 'fields.emailPlaceholder',
      },
    ],
  },
]
