// components/Admin/SectionLoader.tsx
import React, { Suspense } from 'react';

interface SectionLoaderProps {
  sectionId: string;
}

// Función para mapear sectionId a nombres de componente
const getComponentName = (sectionId: string): string => {
  const componentMap: { [key: string]: string } = {
    apprentices_creation: 'ApprenticesCreation',
    apprentices_update: 'ApprenticesUpdate', 
    apprentices_deletion: 'ApprenticesDeletion',
    artists_creation: 'ArtistsCreation',
    artists_update: 'ArtistsUpdate',
    artists_deletion: 'ArtistsDeletion',
    groups_creation: 'GroupsCreation',
    groups_update: 'GroupsUpdate',
    groups_deletion: 'GroupsDeletion',
    songs_creation: 'SongsCreation',
    songs_update: 'SongsUpdate',
    songs_deletion: 'SongsDeletion',
    albums_creation: 'AlbumsCreation',
    albums_update: 'AlbumsUpdate',
    albums_deletion: 'AlbumsDeletion',
    activities_creation: 'ActivitiesCreation',
    activities_update: 'ActivitiesUpdate',
    activities_deletion: 'ActivitiesDeletion',
    incomes_creation: 'IncomesCreation',
    incomes_update: 'IncomesUpdate',
    incomes_deletion: 'IncomesDeletion',
    responsible_creation: 'ResponsibleCreation',
    responsible_update: 'ResponsibleUpdate',
    responsible_deletion: 'ResponsibleDeletion',
    place_creation: 'PlaceCreation',
    place_update: 'PlaceUpdate',
    place_deletion: 'PlaceDeletion',
    contract_creation: 'ContractCreation',
    contract_update: 'ContractUpdate',
    contract_deletion: 'ContractDeletion',
    evaluation_creation: 'EvaluationCreation',
    evaluation_update: 'EvaluationUpdate',
    evaluation_deletion: 'EvaluationDeletion',
  };

  return componentMap[sectionId] || 'ApprenticesCreation';
};

const SectionLoader: React.FC<SectionLoaderProps> = ({ sectionId }) => {
  const componentName = getComponentName(sectionId);
  
  const SectionComponent = React.lazy(() => 
    import(`./sections/${componentName}`)
  );

  return (
    <Suspense fallback={
      <div className="loading-section">
        <div className="loading-spinner">Cargando {componentName}...</div>
      </div>
    }>
      <SectionComponent />
    </Suspense>
  );
};

export default SectionLoader;