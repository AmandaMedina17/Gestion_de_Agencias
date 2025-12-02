import React, { useState, useEffect, useRef } from "react";
import { useContract } from "../../../../context/ContractContext";
import { useAgency } from "../../../../context/AgencyContext";
import { useArtist } from "../../../../context/ArtistContext";
import { Icon } from "../../../icons";
import "./ContractStyle.css";

export enum ContractStatus {
  ACTIVO = "ACTIVO",
  FINALIZADO = "FINALIZADO",
  EN_RENOVACION = "EN_RENOVACION",
  RESCINDIDO = "RESCINDIDO",
}

const ContractManagement: React.FC = () => {
  const {
    contracts,
    fetchContracts,
    createContract,
    updateContract,
    deleteContract,
    loading,
    error,
    clearError,
  } = useContract();

  // Obtener agencias y artistas del contexto
  const { agencies, fetchAgencies } = useAgency();
  const { artists, fetchArtists } = useArtist();

  // Estados principales
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<
    "artist" | "agency" | "startDate" | "endDate" | "status"
  >("artist");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContract, setEditingContract] = useState<any>(null);
  const [deletingContract, setDeletingContract] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Referencias para dropdowns
  const agencyDropdownRef = useRef<HTMLDivElement>(null);
  const artistDropdownRef = useRef<HTMLDivElement>(null);
  const editAgencyDropdownRef = useRef<HTMLDivElement>(null);
  const editArtistDropdownRef = useRef<HTMLDivElement>(null);

  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  const [showArtistDropdown, setShowArtistDropdown] = useState(false);
  const [showEditAgencyDropdown, setShowEditAgencyDropdown] = useState(false);
  const [showEditArtistDropdown, setShowEditArtistDropdown] = useState(false);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Estados del formulario
  const [newContract, setNewContract] = useState({
    startDate: "",
    endDate: "",
    agencyId: "",
    artistId: "",
    distributionPercentage: "",
    status: ContractStatus.ACTIVO,
    conditions: "",
  });

  const [editContract, setEditContract] = useState({
    startDate: "",
    endDate: "",
    agencyId: "",
    artistId: "",
    distributionPercentage: "",
    status: ContractStatus.ACTIVO,
    conditions: "",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        agencyDropdownRef.current &&
        !agencyDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAgencyDropdown(false);
      }
      if (
        artistDropdownRef.current &&
        !artistDropdownRef.current.contains(event.target as Node)
      ) {
        setShowArtistDropdown(false);
      }
      if (
        editAgencyDropdownRef.current &&
        !editAgencyDropdownRef.current.contains(event.target as Node)
      ) {
        setShowEditAgencyDropdown(false);
      }
      if (
        editArtistDropdownRef.current &&
        !editArtistDropdownRef.current.contains(event.target as Node)
      ) {
        setShowEditArtistDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cargar contratos, agencias y artistas cuando se monta el componente
  useEffect(() => {
    const loadInitialData = async () => {
      if (!dataLoaded) {
        clearError();
        try {
          await Promise.all([
            fetchContracts(),
            fetchAgencies(),
            fetchArtists(),
          ]);
          setDataLoaded(true);
        } catch (err) {
          console.error("Error loading initial data:", err);
        }
      }
    };

    loadInitialData();
  }, [dataLoaded]);

  // Resetear página cuando cambien filtro u orden
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortBy, sortOrder]);

  // Obtener agencia y artista seleccionados
  const getSelectedAgency = (agencyId: string) => {
    return agencies.find((a) => a.id === agencyId);
  };

  const getSelectedArtist = (artistId: string) => {
    return artists.find((a) => a.id === artistId);
  };

  // Obtener nombre de la agencia y artista por ID
  const getAgencyName = (agencyId: string) => {
    const agency = getSelectedAgency(agencyId);
    return agency ? `${agency.nameAgency} - ${agency.place}` : "No asignada";
  };

  const getArtistName = (artistId: string) => {
    const artist = getSelectedArtist(artistId);
    return artist ? artist.stageName : "No asignado";
  };

  // Filtrar y ordenar contratos
  const filteredAndSortedContracts = React.useMemo(() => {
    if (!dataLoaded) return [];

    let filtered = contracts;

    // Aplicar filtro por artista o agencia
    if (filter) {
      filtered = contracts.filter(
        (contract) =>
          contract.artist.stageName
            .toLowerCase()
            .includes(filter.toLowerCase()) ||
          contract.agency.nameAgency
            .toLowerCase()
            .includes(filter.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    const sorted = [...filtered].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "artist":
          aValue = a.artist;
          bValue = b.artist;
          break;
        case "agency":
          aValue = a.agency;
          bValue = b.agency;
          break;
        case "startDate":
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        case "endDate":
          aValue = new Date(a.endDate);
          bValue = new Date(b.endDate);
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.artist;
          bValue = b.artist;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [contracts, filter, sortBy, sortOrder, dataLoaded, agencies, artists]);

  // PAGINACIÓN: calcular páginas y slice
  const totalPages = Math.ceil(
    filteredAndSortedContracts.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContracts = filteredAndSortedContracts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // CORREGIDO: Manejar creación de contrato
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    if (
      !newContract.startDate ||
      !newContract.endDate ||
      !newContract.agencyId ||
      !newContract.artistId ||
      !newContract.distributionPercentage ||
      !newContract.conditions.trim()
    ) {
      setMessage({
        type: "error",
        text: "Por favor, complete todos los campos obligatorios",
      });
      return;
    }

    if (new Date(newContract.startDate) >= new Date(newContract.endDate)) {
      setMessage({
        type: "error",
        text: "La fecha de inicio debe ser anterior a la fecha de fin",
      });
      return;
    }

    const distributionPercentage = parseFloat(
      newContract.distributionPercentage
    );
    if (distributionPercentage < 0 || distributionPercentage > 100) {
      setMessage({
        type: "error",
        text: "El porcentaje de distribución debe estar entre 0 y 100",
      });
      return;
    }

    try {
      // Crear el objeto de datos para enviar
      const contractData = {
        startDate: new Date(newContract.startDate),
        endDate: new Date(newContract.endDate),
        agencyId: newContract.agencyId,
        artistId: newContract.artistId,
        distributionPercentage: distributionPercentage,
        status: newContract.status,
        conditions: newContract.conditions.trim(),
      };

      console.log("Enviando contrato al backend:", contractData);

      // Llamar a createContract
      await createContract(contractData);

      setMessage({
        type: "success",
        text: `Contrato creado exitosamente`,
      });

      // Resetear formulario
      setNewContract({
        startDate: "",
        endDate: "",
        agencyId: "",
        artistId: "",
        distributionPercentage: "",
        status: ContractStatus.ACTIVO,
        conditions: "",
      });

      setShowCreateForm(false);
      await fetchContracts();

      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      console.error("Error al crear contrato:", err);
      setMessage({
        type: "error",
        text: err.message || "Error al crear el contrato",
      });
    }
  };

  // CORREGIDO: Manejar actualización de contrato
  const handleUpdate = async () => {
    if (!editingContract) return;

    if (
      !editContract.startDate ||
      !editContract.endDate ||
      !editContract.agencyId ||
      !editContract.artistId ||
      !editContract.distributionPercentage ||
      !editContract.conditions.trim()
    ) {
      setMessage({
        type: "error",
        text: "Por favor, complete todos los campos obligatorios",
      });
      return;
    }

    if (new Date(editContract.startDate) >= new Date(editContract.endDate)) {
      setMessage({
        type: "error",
        text: "La fecha de inicio debe ser anterior a la fecha de fin",
      });
      return;
    }

    const distributionPercentage = parseFloat(
      editContract.distributionPercentage
    );
    if (distributionPercentage < 0 || distributionPercentage > 100) {
      setMessage({
        type: "error",
        text: "El porcentaje de distribución debe estar entre 0 y 100",
      });
      return;
    }

    try {
      const contractData = {
        startDate: new Date(editContract.startDate),
        endDate: new Date(editContract.endDate),
        agencyId: editContract.agencyId,
        artistId: editContract.artistId,
        distributionPercentage: distributionPercentage,
        status: editContract.status,
        conditions: editContract.conditions.trim(),
      };

      console.log("Actualizando contrato:", contractData);

      await updateContract(editingContract.id, contractData);

      setMessage({
        type: "success",
        text: `Contrato actualizado exitosamente`,
      });

      setEditingContract(null);
      setEditContract({
        startDate: "",
        endDate: "",
        agencyId: "",
        artistId: "",
        distributionPercentage: "",
        status: ContractStatus.ACTIVO,
        conditions: "",
      });

      await fetchContracts();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      console.error("Error al actualizar contrato:", err);
      setMessage({
        type: "error",
        text: err.message || "Error al actualizar el contrato",
      });
    }
  };

  // Manejar eliminación de contrato
  const handleDelete = async () => {
    if (!deletingContract) return;

    try {
      await deleteContract(deletingContract.id);
      setMessage({
        type: "success",
        text: `Contrato eliminado exitosamente`,
      });
      setDeletingContract(null);
      await fetchContracts();
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al eliminar el contrato",
      });
    }
  };

  // Recargar datos manualmente
  const handleReload = async () => {
    clearError();
    try {
      await fetchContracts();
      setMessage({
        type: "success",
        text: "Datos actualizados correctamente",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Error al recargar los datos",
      });
    }
  };

  // Iniciar edición
  const startEdit = (contract: any) => {
    setEditingContract(contract);
    setEditContract({
      startDate: contract.startDate.split("T")[0],
      endDate: contract.endDate.split("T")[0],
      agencyId: contract.agencyId,
      artistId: contract.artistId,
      distributionPercentage: contract.distributionPercentage.toString(),
      status: contract.status,
      conditions: contract.conditions,
    });
  };

  // Iniciar eliminación
  const startDelete = (contract: any) => {
    setDeletingContract(contract);
  };

  // Limpiar filtro
  const handleClearFilter = () => {
    setFilter("");
  };

  // Alternar ordenamiento
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  // Traducir estados
  const getStatusText = (status: ContractStatus) => {
    const statusMap = {
      [ContractStatus.ACTIVO]: "Activo",
      [ContractStatus.EN_RENOVACION]: "En renovación",
      [ContractStatus.RESCINDIDO]: "Rescindido",
      [ContractStatus.FINALIZADO]: "Finalizado",
    };
    return statusMap[status] || status;
  };

  // Obtener fecha actual en formato YYYY-MM-DD
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Calcular días restantes
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle agency selection
  const handleAgencySelect = (agencyId: string) => {
    setNewContract({
      ...newContract,
      agencyId: agencyId,
    });
    setShowAgencyDropdown(false);
  };

  const handleEditAgencySelect = (agencyId: string) => {
    setEditContract({
      ...editContract,
      agencyId: agencyId,
    });
    setShowEditAgencyDropdown(false);
  };

  // Handle artist selection
  const handleArtistSelect = (artistId: string) => {
    setNewContract({
      ...newContract,
      artistId: artistId,
    });
    setShowArtistDropdown(false);
  };

  const handleEditArtistSelect = (artistId: string) => {
    setEditContract({
      ...editContract,
      artistId: artistId,
    });
    setShowEditArtistDropdown(false);
  };

  return (
    <section id="contract_manager" className="content-section active">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Gestión de Contratos</h1>
          <p className="section-description">
            Administre todos los contratos del sistema
          </p>
        </div>
      </div>

      <div className="detail-card">
        {/* Mensajes globales */}
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        {error && <div className="message error">{error}</div>}

        {/* Controles superiores */}
        <div className="manager-controls">
          <div className="controls-left">
            <button
              className="create-button"
              onClick={() => setShowCreateForm(true)}
              disabled={loading}
            >
              <span className="button-icon">
                <Icon name="plus" size={20} />
              </span>
              Nuevo Contrato
            </button>
          </div>

          <div className="controls-right">
            <div className="filter-group">
              <input
                type="text"
                className="form-input search-input"
                placeholder="Filtrar por artista o agencia..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                disabled={loading}
              />
              {filter && (
                <button
                  className="clear-filter-btn"
                  onClick={handleClearFilter}
                  title="Limpiar filtro"
                >
                  ×
                </button>
              )}
            </div>

            <div className="sort-group">
              <select
                className="form-select sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                disabled={loading}
              >
                <option value="artist">Ordenar por artista</option>
                <option value="agency">Ordenar por agencia</option>
                <option value="startDate">Ordenar por fecha inicio</option>
                <option value="endDate">Ordenar por fecha fin</option>
                <option value="status">Ordenar por estado</option>
              </select>
              <button
                className="sort-order-btn"
                onClick={toggleSortOrder}
                disabled={loading}
                title={
                  sortOrder === "asc" ? "Orden ascendente" : "Orden descendente"
                }
              >
                {sortOrder === "asc" ? (
                  <Icon name="down" size={18} />
                ) : (
                  <Icon name="up" size={18} />
                )}
              </button>
            </div>

            <button
              className="reload-button"
              onClick={handleReload}
              disabled={loading}
              title="Recargar datos"
            >
              {loading ? "⟳" : "↻"}
            </button>
          </div>
        </div>

        {/* Contador de resultados */}
        {dataLoaded && (
          <div className="results-info">
            <span className="results-count">
              {filteredAndSortedContracts.length} de {contracts.length}{" "}
              contratos
            </span>
            <span className="sort-info">
              Orden:{" "}
              {sortBy === "artist"
                ? "Artista"
                : sortBy === "agency"
                ? "Agencia"
                : sortBy === "startDate"
                ? "Fecha Inicio"
                : sortBy === "endDate"
                ? "Fecha Fin"
                : "Estado"}{" "}
              •{sortOrder === "asc" ? " Ascendente" : " Descendente"}
            </span>
          </div>
        )}

        {/* Grid de contratos */}
        <div className="contracts-grid">
          {!dataLoaded ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando contratos...</p>
            </div>
          ) : loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Actualizando...</p>
            </div>
          ) : filteredAndSortedContracts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No hay contratos</h3>
              <p>
                {filter
                  ? `No se encontraron resultados para "${filter}"`
                  : "Comience agregando el primer contrato"}
              </p>
              {!filter && (
                <button
                  className="create-button"
                  onClick={() => setShowCreateForm(true)}
                  disabled={loading}
                >
                  <span className="button-icon">
                    <Icon name="plus" size={20} />
                  </span>
                  Crear Primer Contrato
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table className="contracts-table">
                <thead>
                  <tr>
                    <th>Artista</th>
                    <th>Agencia</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Días Restantes</th>
                    <th>Distribución</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedContracts.map((contract) => {
                    const daysRemaining = getDaysRemaining(
                      contract.endDate.toString()
                    );

                    return (
                      <tr key={contract.id} className="contract-row">
                        <td className="contract-artist-cell">
                          <div className="contract-artist">
                            {contract.artist.stageName}
                          </div>
                        </td>
                        <td>
                          <div className="detail-value">
                            {contract.agency.nameAgency}
                          </div>
                        </td>
                        <td>
                          <div className="detail-value">
                            {formatDate(contract.startDate.toString())}
                          </div>
                        </td>
                        <td>
                          <div className="detail-value">
                            {formatDate(contract.endDate.toString())}
                          </div>
                        </td>
                        <td>
                          <div
                            className={`days-remaining ${
                              daysRemaining < 30
                                ? "warning"
                                : daysRemaining < 0
                                ? "expired"
                                : ""
                            }`}
                          >
                            {daysRemaining >= 0
                              ? `${daysRemaining} días`
                              : "Expirado"}
                          </div>
                        </td>
                        <td>
                          <div className="detail-value">
                            {contract.distributionPercentage}%
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-badge status-${contract.status.toLowerCase()}`}
                          >
                            {getStatusText(contract.status)}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => startEdit(contract)}
                              title="Editar contrato"
                              disabled={loading}
                            >
                              <Icon name="edit" size={18} />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => startDelete(contract)}
                              title="Eliminar contrato"
                              disabled={loading}
                            >
                              <Icon name="trash" size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* PAGINACIÓN */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    ◀ Anterior
                  </button>

                  <span className="pagination-info">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Siguiente ▶
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de creación */}
      {showCreateForm && (
        <div className="modal-overlay contract-modal">
          <div className="modal-content">
            <h3>Crear Nuevo Contrato</h3>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Artista *</label>
                  <div className="dropdown-container" ref={artistDropdownRef}>
                    <button
                      type="button"
                      className="dropdown-toggle"
                      onClick={() => setShowArtistDropdown(!showArtistDropdown)}
                    >
                      <span>
                        {newContract.artistId
                          ? getArtistName(newContract.artistId)
                          : "Seleccionar artista"}
                      </span>
                      <Icon
                        name={showArtistDropdown ? "up" : "down"}
                        size={16}
                      />
                    </button>

                    {showArtistDropdown && (
                      <div className="dropdown-menu">
                        <div className="dropdown-list">
                          {artists.map((artist) => (
                            <div
                              key={artist.id}
                              className={`dropdown-item ${
                                newContract.artistId === artist.id
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => handleArtistSelect(artist.id)}
                            >
                              {artist.stageName}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {artists.length === 0 && (
                    <div className="no-items">No hay artistas disponibles</div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Agencia *</label>
                  <div className="dropdown-container" ref={agencyDropdownRef}>
                    <button
                      type="button"
                      className="dropdown-toggle"
                      onClick={() => setShowAgencyDropdown(!showAgencyDropdown)}
                    >
                      <span>
                        {newContract.agencyId
                          ? getAgencyName(newContract.agencyId)
                          : "Seleccionar agencia"}
                      </span>
                      <Icon
                        name={showAgencyDropdown ? "up" : "down"}
                        size={16}
                      />
                    </button>

                    {showAgencyDropdown && (
                      <div className="dropdown-menu">
                        <div className="dropdown-list">
                          {agencies.map((agency) => (
                            <div
                              key={agency.id}
                              className={`dropdown-item ${
                                newContract.agencyId === agency.id
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => handleAgencySelect(agency.id)}
                            >
                              {agency.nameAgency} - {agency.place}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {agencies.length === 0 && (
                    <div className="no-items">No hay agencias disponibles</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Fecha de inicio *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newContract.startDate}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        startDate: e.target.value,
                      })
                    }
                    required
                    min={getTodayDate()}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha de fin *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newContract.endDate}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        endDate: e.target.value,
                      })
                    }
                    required
                    min={newContract.startDate || getTodayDate()}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Porcentaje de distribución *
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Ej: 30"
                    value={newContract.distributionPercentage}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        distributionPercentage: e.target.value,
                      })
                    }
                    required
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="input-suffix">%</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={newContract.status}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        status: e.target.value as ContractStatus,
                      })
                    }
                  >
                    <option value={ContractStatus.ACTIVO}>Activo</option>
                    <option value={ContractStatus.EN_RENOVACION}>
                      En renovación
                    </option>
                    <option value={ContractStatus.RESCINDIDO}>
                      Rescindido
                    </option>
                    <option value={ContractStatus.FINALIZADO}>
                      Finalizado
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label className="form-label">Condiciones *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe las condiciones del contrato..."
                    value={newContract.conditions}
                    onChange={(e) =>
                      setNewContract({
                        ...newContract,
                        conditions: e.target.value,
                      })
                    }
                    required
                    rows={4}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={
                    loading ||
                    !newContract.startDate ||
                    !newContract.endDate ||
                    !newContract.agencyId ||
                    !newContract.artistId ||
                    !newContract.distributionPercentage ||
                    !newContract.conditions.trim()
                  }
                >
                  {loading ? "Creando..." : "Crear Contrato"}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewContract({
                      startDate: "",
                      endDate: "",
                      agencyId: "",
                      artistId: "",
                      distributionPercentage: "",
                      status: ContractStatus.ACTIVO,
                      conditions: "",
                    });
                  }}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editingContract && (
        <div className="modal-overlay contract-modal">
          <div className="modal-content">
            <h3>Editar Contrato</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Artista *</label>
                <div className="dropdown-container" ref={editArtistDropdownRef}>
                  <button
                    type="button"
                    className="dropdown-toggle"
                    onClick={() =>
                      setShowEditArtistDropdown(!showEditArtistDropdown)
                    }
                  >
                    <span>
                      {editContract.artistId
                        ? getArtistName(editContract.artistId)
                        : "Seleccionar artista"}
                    </span>
                    <Icon
                      name={showEditArtistDropdown ? "up" : "down"}
                      size={16}
                    />
                  </button>

                  {showEditArtistDropdown && (
                    <div className="dropdown-menu">
                      <div className="dropdown-list">
                        {artists.map((artist) => (
                          <div
                            key={artist.id}
                            className={`dropdown-item ${
                              editContract.artistId === artist.id
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => handleEditArtistSelect(artist.id)}
                          >
                            {artist.stageName}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {artists.length === 0 && (
                  <div className="no-items">No hay artistas disponibles</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Agencia *</label>
                <div className="dropdown-container" ref={editAgencyDropdownRef}>
                  <button
                    type="button"
                    className="dropdown-toggle"
                    onClick={() =>
                      setShowEditAgencyDropdown(!showEditAgencyDropdown)
                    }
                  >
                    <span>
                      {editContract.agencyId
                        ? getAgencyName(editContract.agencyId)
                        : "Seleccionar agencia"}
                    </span>
                    <Icon
                      name={showEditAgencyDropdown ? "up" : "down"}
                      size={16}
                    />
                  </button>

                  {showEditAgencyDropdown && (
                    <div className="dropdown-menu">
                      <div className="dropdown-list">
                        {agencies.map((agency) => (
                          <div
                            key={agency.id}
                            className={`dropdown-item ${
                              editContract.agencyId === agency.id
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => handleEditAgencySelect(agency.id)}
                          >
                            {agency.nameAgency} - {agency.place}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {agencies.length === 0 && (
                  <div className="no-items">No hay agencias disponibles</div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha de inicio *</label>
                <input
                  type="date"
                  className="form-input"
                  value={editContract.startDate}
                  onChange={(e) =>
                    setEditContract({
                      ...editContract,
                      startDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fecha de fin *</label>
                <input
                  type="date"
                  className="form-input"
                  value={editContract.endDate}
                  onChange={(e) =>
                    setEditContract({
                      ...editContract,
                      endDate: e.target.value,
                    })
                  }
                  required
                  min={editContract.startDate}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Porcentaje de distribución *
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={editContract.distributionPercentage}
                  onChange={(e) =>
                    setEditContract({
                      ...editContract,
                      distributionPercentage: e.target.value,
                    })
                  }
                  required
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="input-suffix">%</span>
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={editContract.status}
                  onChange={(e) =>
                    setEditContract({
                      ...editContract,
                      status: e.target.value as ContractStatus,
                    })
                  }
                >
                  <option value={ContractStatus.ACTIVO}>Activo</option>
                  <option value={ContractStatus.EN_RENOVACION}>
                    En renovación
                  </option>
                  <option value={ContractStatus.RESCINDIDO}>Rescindido</option>
                  <option value={ContractStatus.FINALIZADO}>Finalizado</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label className="form-label">Condiciones *</label>
                <textarea
                  className="form-textarea"
                  value={editContract.conditions}
                  onChange={(e) =>
                    setEditContract({
                      ...editContract,
                      conditions: e.target.value,
                    })
                  }
                  required
                  rows={4}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="submit-button"
                onClick={handleUpdate}
                disabled={
                  loading ||
                  !editContract.startDate ||
                  !editContract.endDate ||
                  !editContract.agencyId ||
                  !editContract.artistId ||
                  !editContract.distributionPercentage ||
                  !editContract.conditions.trim()
                }
              >
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
              <button
                className="cancel-button"
                onClick={() => {
                  setEditingContract(null);
                  setEditContract({
                    startDate: "",
                    endDate: "",
                    agencyId: "",
                    artistId: "",
                    distributionPercentage: "",
                    status: ContractStatus.ACTIVO,
                    conditions: "",
                  });
                }}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deletingContract && (
        <div className="modal-overlay contract-modal">
          <div className="modal-content">
            <h3>¿Eliminar Contrato?</h3>
            <div className="delete-confirmation">
              <p>¿Está seguro de que desea eliminar este contrato?</p>
              <div className="contract-details">
                <div className="detail-item">
                  <strong>Artista:</strong>{" "}
                  {getArtistName(deletingContract.artistId)}
                </div>
                <div className="detail-item">
                  <strong>Agencia:</strong>{" "}
                  {getAgencyName(deletingContract.agencyId)}
                </div>
                <div className="detail-item">
                  <strong>Fecha de inicio:</strong>{" "}
                  {formatDate(deletingContract.startDate)}
                </div>
                <div className="detail-item">
                  <strong>Fecha de fin:</strong>{" "}
                  {formatDate(deletingContract.endDate)}
                </div>
                <div className="detail-item">
                  <strong>Distribución:</strong>{" "}
                  {deletingContract.distributionPercentage}%
                </div>
                <div className="detail-item">
                  <strong>Estado:</strong>{" "}
                  {getStatusText(deletingContract.status)}
                </div>
                <div className="detail-item">
                  <strong>Condiciones:</strong> {deletingContract.conditions}
                </div>
              </div>
              <p className="warning-text">
                ⚠️ Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="submit-button delete-button"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Sí, Eliminar"}
              </button>
              <button
                className="cancel-button"
                onClick={() => setDeletingContract(null)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContractManagement;
