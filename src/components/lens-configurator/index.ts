/**
 * Lens Configurator - Barrel exports
 *
 * Default: nuevo configurador Mexilux (4 pasos).
 * El wizard largo (5 pasos: usage_type, prescription, material, treatments, review)
 * sigue disponible vía export nombrado para compatibilidad con código admin.
 */

export { default } from './MexiluxConfigurator';
export { default as MexiluxConfigurator } from './MexiluxConfigurator';

export { LensConfiguratorWizard } from './LensConfiguratorWizard';
export { WizardProgress } from './WizardProgress';
export { WizardNavigation } from './WizardNavigation';

export { UsageTypeStep } from './steps/UsageTypeStep';
export { PrescriptionStep } from './steps/PrescriptionStep';
export { MaterialStep } from './steps/MaterialStep';
export { TreatmentsStep } from './steps/TreatmentsStep';
export { ReviewStep } from './steps/ReviewStep';

import './lens-configurator.css';
