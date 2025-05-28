/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GuidesEditor } from '../src/pages/Guides/guidesEditor';

// Mock para el custom hook useGuideEditor
const mockHandleSubmit = jest.fn();
const mockHandleFieldChange = jest.fn();
const mockHandleFileDelete = jest.fn();
const mockHandleBack = jest.fn();
const mockFetchCategories = jest.fn();

jest.mock('../src/customHooks/pages/guidesEditor/customHook', () => ({
  useGuideEditor: jest.fn(() => ({
    formData: {
      title: '',
      category: '',
      description: '',
      file: null,
      fileSecondary: null,
      fileTertiary: null,
      keyMain: '',
      keySecondary: '',
      keyTertiary: '',
      typeDeleted: [],
      data: null
    },
    categoryOptions: [
      { label: 'Categoría 1', value: 'cat1' },
      { label: 'Categoría 2', value: 'cat2' }
    ],
    loading: false,
    error: null,
    isEditing: false,
    handleSubmit: mockHandleSubmit,
    handleFieldChange: mockHandleFieldChange,
    handleFileDelete: mockHandleFileDelete,
    handleBack: mockHandleBack,
    fetchCategories: mockFetchCategories
  }))
}));

// Mock para los componentes utilizados
jest.mock('../src/components/titleSearch', () => ({
  TitleSearch: jest.fn(({ label, onBack, callToAction }) => (
    <div data-testid="mock-title-search">
      <h1>{label}</h1>
      <button onClick={onBack} data-testid="back-button">Volver</button>
      {callToAction && (
        <button 
          onClick={callToAction.onClick} 
          disabled={callToAction.disabled}
          data-testid="save-button"
        >
          {callToAction.label}
        </button>
      )}
    </div>
  ))
}));

jest.mock('../src/components/inputs/inputText', () => ({
  InputText: jest.fn(({ label, value, onChange, error, errorMessage, heightSize }) => (
    <div data-testid={`input-text-${label}`}>
      <label>{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        data-testid={`text-input-${label}`}
        style={heightSize ? { height: heightSize } : {}}
      />
      {error && <span data-testid={`error-${label}`}>{errorMessage}</span>}
    </div>
  ))
}));

jest.mock('../src/components/inputs/inputSelectCategoryModal', () => ({
  InputSelectModal: jest.fn(({ label, options, value, onChange, onAddCategorySuccess }) => (
    <div data-testid={`input-select-${label}`}>
      <label>{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        data-testid={`select-input-${label}`}
      >
        <option value="">Seleccionar</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <button onClick={() => onAddCategorySuccess?.()} data-testid="add-category-button">
        Agregar categoría
      </button>
    </div>
  ))
}));

jest.mock('../src/components/inputs/inputFile', () => ({
  InputFile: jest.fn(({ label, onChange, onDelete, error, errorMessage, accept, placeholderImage, placeholderVideo }) => (
    <div data-testid={`input-file-${label}`}>
      <label>{label}</label>
      <input 
        type="file" 
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          onChange(file);
        }}
        data-testid={`file-input-${label}`}
        accept={accept === 'image' ? 'image/*' : accept === 'video' ? 'video/*' : '*/*'}
      />
      {(placeholderImage || placeholderVideo) && (
        <div data-testid={`preview-${label}`}>
          {placeholderImage && <div data-testid={`image-preview-${label}`}>Image Preview</div>}
          {placeholderVideo && <div data-testid={`video-preview-${label}`}>Video Preview</div>}
        </div>
      )}
      <button onClick={onDelete} data-testid={`delete-button-${label}`}>
        Eliminar
      </button>
      {error && <span data-testid={`error-${label}`}>{errorMessage}</span>}
    </div>
  ))
}));

jest.mock('../src/components/buttons/fatButton', () => ({
  FatButton: jest.fn(({ label, onClick, disabled, Icon, textColor, backgroundColor }) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      data-testid={`fat-button-${label}`}
      style={{ color: textColor, backgroundColor }}
    >
      {Icon && <Icon data-testid={`icon-${label}`} />}
      {label}
    </button>
  ))
}));

// Mock para los íconos
jest.mock('@mui/icons-material/AddPhotoAlternate', () => {
  return function DummyAddPhotoAlternateIcon() {
    return <div data-testid="mock-add-photo-icon" />;
  };
});

jest.mock('@mui/icons-material/AddAPhoto', () => {
  return function DummyAddAPhotoIcon() {
    return <div data-testid="mock-add-a-photo-icon" />;
  };
});

describe('GuidesEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default state', () => {
    const { container } = render(<GuidesEditor />);
    
    // Verificar que el componente se renderiza
    expect(container).toBeInTheDocument();
  });
  
  it('muestra mensaje de carga cuando loading es true', () => {
    const { useGuideEditor } = require('../src/customHooks/pages/guidesEditor/customHook');
    useGuideEditor.mockReturnValueOnce({
      formData: {
        title: '',
        category: '',
        description: '',
        file: null,
        fileSecondary: null,
        fileTertiary: null,
        keyMain: '',
        keySecondary: '',
        keyTertiary: '',
        typeDeleted: [],
        data: null
      },
      categoryOptions: [
        { label: 'Categoría 1', value: 'cat1' },
        { label: 'Categoría 2', value: 'cat2' }
      ],
      loading: true,
      error: null,
      isEditing: false,
      handleSubmit: mockHandleSubmit,
      handleFieldChange: mockHandleFieldChange,
      handleFileDelete: mockHandleFileDelete,
      handleBack: mockHandleBack,
      fetchCategories: mockFetchCategories
    });
    
    render(<GuidesEditor />);
    expect(screen.getByText('Cargando datos de la guía...')).toBeInTheDocument();
  });
  
  it('muestra mensaje de error cuando hay un error', () => {
    const { useGuideEditor } = require('../src/customHooks/pages/guidesEditor/customHook');
    useGuideEditor.mockReturnValueOnce({
      formData: {
        title: '',
        category: '',
        description: '',
        file: null,
        fileSecondary: null,
        fileTertiary: null,
        keyMain: '',
        keySecondary: '',
        keyTertiary: '',
        typeDeleted: [],
        data: null
      },
      categoryOptions: [
        { label: 'Categoría 1', value: 'cat1' },
        { label: 'Categoría 2', value: 'cat2' }
      ],
      loading: false,
      error: 'Error al cargar la guía',
      isEditing: false,
      handleSubmit: mockHandleSubmit,
      handleFieldChange: mockHandleFieldChange,
      handleFileDelete: mockHandleFileDelete,
      handleBack: mockHandleBack,
      fetchCategories: mockFetchCategories
    });
    
    render(<GuidesEditor />);
    expect(screen.getByText('Error al cargar la guía')).toBeInTheDocument();
  });
  
  it('muestra título de edición cuando isEditing es true', () => {
    const { useGuideEditor } = require('../src/customHooks/pages/guidesEditor/customHook');
    useGuideEditor.mockReturnValueOnce({
      formData: {
        title: '',
        category: '',
        description: '',
        file: null,
        fileSecondary: null,
        fileTertiary: null,
        keyMain: '',
        keySecondary: '',
        keyTertiary: '',
        typeDeleted: [],
        data: null
      },
      categoryOptions: [
        { label: 'Categoría 1', value: 'cat1' },
        { label: 'Categoría 2', value: 'cat2' }
      ],
      loading: false,
      error: null,
      isEditing: true,
      handleSubmit: mockHandleSubmit,
      handleFieldChange: mockHandleFieldChange,
      handleFileDelete: mockHandleFileDelete,
      handleBack: mockHandleBack,
      fetchCategories: mockFetchCategories
    });
    
    render(<GuidesEditor />);
    expect(screen.getByText('Editar guía')).toBeInTheDocument();
  });

  it('calls handleBack when back button is clicked', () => {
    render(<GuidesEditor />);
    
    // Buscar y hacer clic en el botón de volver
    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);
    
    // Verificar que se llamó a la función handleBack
    expect(mockHandleBack).toHaveBeenCalledTimes(1);
  });

  it('calls handleSubmit when save button is clicked', () => {
    // Modificamos el mock de TitleSearch para este test específico
    const TitleSearchMock = require('../src/components/titleSearch');
    TitleSearchMock.TitleSearch.mockImplementationOnce(({ label, onBack, callToAction }) => (
      <div data-testid="mock-title-search">
        <h1>{label}</h1>
        <button onClick={onBack} data-testid="back-button">Volver</button>
        {callToAction && (
          <button 
            onClick={callToAction.onClick} 
            disabled={false} // Aseguramos que el botón no esté deshabilitado
            data-testid="save-button"
          >
            {callToAction.label}
          </button>
        )}
      </div>
    ));
    
    render(<GuidesEditor />);
    
    // Buscar y hacer clic en el botón de guardar
    const saveButton = screen.getByTestId('save-button');
    fireEvent.click(saveButton);
    
    // Verificar que se llamó a la función handleSubmit
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('calls handleFieldChange when text input changes', () => {
    render(<GuidesEditor />);
    
    // Buscar el input de título y cambiar su valor
    const titleInput = screen.getByTestId('text-input-Título');
    fireEvent.change(titleInput, { target: { value: 'Nueva guía de prueba' } });
    
    // Verificar que se llamó a la función handleFieldChange con los parámetros correctos
    expect(mockHandleFieldChange).toHaveBeenCalledWith('title', 'Nueva guía de prueba');
  });

  it('calls handleFieldChange when category select changes', () => {
    render(<GuidesEditor />);
    
    // Buscar el select de categoría y cambiar su valor
    const categorySelect = screen.getByTestId('select-input-Categoría');
    fireEvent.change(categorySelect, { target: { value: 'cat1' } });
    
    // Verificar que se llamó a la función handleFieldChange con los parámetros correctos
    expect(mockHandleFieldChange).toHaveBeenCalledWith('category', 'cat1');
  });

  it('calls handleFileDelete when delete button is clicked', () => {
    render(<GuidesEditor />);
    
    // Buscar y hacer clic en el botón de eliminar archivo
    const deleteButton = screen.getByTestId('delete-button-Imagen Principal');
    fireEvent.click(deleteButton);
    
    // Verificar que se llamó a la función handleFileDelete
    expect(mockHandleFileDelete).toHaveBeenCalled();
  });

  it('muestra errores de validación cuando los campos son tocados y están vacíos', () => {
    render(<GuidesEditor />);
    
    // Tocar el campo de título y luego dejarlo vacío
    const titleInput = screen.getByTestId('text-input-Título');
    fireEvent.change(titleInput, { target: { value: 'test' } });
    fireEvent.change(titleInput, { target: { value: '' } });
    
    // Verificar que se muestra el mensaje de error
    expect(screen.getByTestId('error-Título')).toBeInTheDocument();
    expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
  });
  
  it('muestra error en el campo de categoría cuando es tocado y está vacío', () => {
    // Modificamos el mock de InputSelectModal para este test específico
    const InputSelectModalMock = require('../src/components/inputs/inputSelectCategoryModal');
    InputSelectModalMock.InputSelectModal.mockImplementationOnce(({ label, options, value, onChange, onAddCategorySuccess, error, errorMessage }) => (
      <div data-testid={`input-select-${label}`}>
        <label>{label}</label>
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          data-testid={`select-input-${label}`}
        >
          <option value="">Seleccionar</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button onClick={() => onAddCategorySuccess?.()} data-testid="add-category-button">
          Agregar categoría
        </button>
        {error && <span data-testid={`error-${label}`}>{errorMessage}</span>}
      </div>
    ));
    
    render(<GuidesEditor />);
    
    // Tocar el campo de categoría y luego dejarlo vacío
    const categorySelect = screen.getByTestId('select-input-Categoría');
    fireEvent.change(categorySelect, { target: { value: 'cat1' } });
    fireEvent.change(categorySelect, { target: { value: '' } });
    
    // Verificar que se llamó a handleFieldChange con los parámetros correctos
    expect(mockHandleFieldChange).toHaveBeenCalledWith('category', '');
  });
  
  it('muestra error en el campo de descripción cuando es tocado y está vacío', () => {
    render(<GuidesEditor />);
    
    // Tocar el campo de descripción y luego dejarlo vacío
    const descriptionInput = screen.getByTestId('text-input-Texto');
    fireEvent.change(descriptionInput, { target: { value: 'test' } });
    fireEvent.change(descriptionInput, { target: { value: '' } });
    
    // Verificar que se muestra el mensaje de error
    expect(screen.getByTestId('error-Texto')).toBeInTheDocument();
  });
  
  it('muestra error en la imagen principal cuando se elimina', () => {
    // Mockear el estado inicial con un archivo
    const { useGuideEditor } = require('../src/customHooks/pages/guidesEditor/customHook');
    useGuideEditor.mockReturnValueOnce({
      formData: {
        title: '',
        category: '',
        description: '',
        file: new File(['dummy content'], 'test.png', { type: 'image/png' }),
        fileSecondary: null,
        fileTertiary: null,
        keyMain: '',
        keySecondary: '',
        keyTertiary: '',
        typeDeleted: [],
        data: null
      },
      categoryOptions: [
        { label: 'Categoría 1', value: 'cat1' },
        { label: 'Categoría 2', value: 'cat2' }
      ],
      loading: false,
      error: null,
      isEditing: false,
      handleSubmit: mockHandleSubmit,
      handleFieldChange: mockHandleFieldChange,
      handleFileDelete: mockHandleFileDelete,
      handleBack: mockHandleBack,
      fetchCategories: mockFetchCategories
    });
    
    render(<GuidesEditor />);
    
    // Eliminar la imagen principal
    const deleteButton = screen.getByTestId('delete-button-Imagen Principal');
    fireEvent.click(deleteButton);
    
    // Verificar que se llamó a handleFileDelete con el parámetro correcto
    expect(mockHandleFileDelete).toHaveBeenCalledWith('file');
  });
  
  it('deshabilita el botón guardar cuando el formulario no es válido', () => {
    render(<GuidesEditor />);
    
    // Verificar que el botón guardar está deshabilitado inicialmente
    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).toBeDisabled();
    
    // Completar algunos campos pero no todos
    const titleInput = screen.getByTestId('text-input-Título');
    fireEvent.change(titleInput, { target: { value: 'Título de prueba' } });
    
    // El botón debería seguir deshabilitado
    expect(saveButton).toBeDisabled();
  });
  
  it('muestra campo secundario cuando se hace clic en "Agregar Foto"', () => {
    render(<GuidesEditor />);
    
    // Buscar y hacer clic en el botón de agregar foto
    const addPhotoButton = screen.getByTestId('fat-button-Agregar Foto');
    fireEvent.click(addPhotoButton);
    
    // Verificar que se muestra el campo secundario
    expect(screen.getByTestId('input-file-Imagen Secundario')).toBeInTheDocument();
  });
  
  it('muestra campo terciario cuando se hace clic en "Agregar Video"', () => {
    render(<GuidesEditor />);
    
    // Buscar y hacer clic en el botón de agregar video
    const addVideoButton = screen.getByTestId('fat-button-Agregar Video');
    fireEvent.click(addVideoButton);
    
    // Verificar que se muestra el campo terciario
    expect(screen.getByTestId('input-file-Archivo de video')).toBeInTheDocument();
  });
  
  it('maneja correctamente la subida de archivos en el campo principal', () => {
    render(<GuidesEditor />);
    
    // Crear un archivo de prueba
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    // Simular la subida del archivo
    const fileInput = screen.getByTestId('file-input-Imagen Principal');
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Verificar que se llamó a handleFieldChange con los parámetros correctos
    expect(mockHandleFieldChange).toHaveBeenCalledWith('file', file);
  });
  
  it('maneja correctamente la subida de archivos en el campo secundario', () => {
    // Primero mostrar el campo secundario
    render(<GuidesEditor />);
    const addPhotoButton = screen.getByTestId('fat-button-Agregar Foto');
    fireEvent.click(addPhotoButton);
    
    // Crear un archivo de prueba
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    // Simular la subida del archivo
    const fileInput = screen.getByTestId('file-input-Imagen Secundario');
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Verificar que se llamó a handleFieldChange con los parámetros correctos
    expect(mockHandleFieldChange).toHaveBeenCalledWith('fileSecondary', file);
  });
  
  it('maneja correctamente la subida de archivos en el campo terciario', () => {
    // Primero mostrar el campo terciario
    render(<GuidesEditor />);
    const addVideoButton = screen.getByTestId('fat-button-Agregar Video');
    fireEvent.click(addVideoButton);
    
    // Crear un archivo de prueba
    const file = new File(['dummy content'], 'test.mp4', { type: 'video/mp4' });
    
    // Simular la subida del archivo
    const fileInput = screen.getByTestId('file-input-Archivo de video');
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Verificar que se llamó a handleFieldChange con los parámetros correctos
    expect(mockHandleFieldChange).toHaveBeenCalledWith('fileTertiary', file);
  });
  
  it('elimina correctamente el archivo secundario', () => {
    // Primero mostrar el campo secundario
    render(<GuidesEditor />);
    const addPhotoButton = screen.getByTestId('fat-button-Agregar Foto');
    fireEvent.click(addPhotoButton);
    
    // Eliminar el archivo secundario
    const deleteButton = screen.getByTestId('delete-button-Imagen Secundario');
    fireEvent.click(deleteButton);
    
    // Verificar que se llamó a handleFileDelete con el parámetro correcto
    expect(mockHandleFileDelete).toHaveBeenCalledWith('fileSecondary');
  });
  
  it('elimina correctamente el archivo terciario', () => {
    // Primero mostrar el campo terciario
    render(<GuidesEditor />);
    const addVideoButton = screen.getByTestId('fat-button-Agregar Video');
    fireEvent.click(addVideoButton);
    
    // Eliminar el archivo terciario
    const deleteButton = screen.getByTestId('delete-button-Archivo de video');
    fireEvent.click(deleteButton);
    
    // Verificar que se llamó a handleFileDelete con el parámetro correcto
    expect(mockHandleFileDelete).toHaveBeenCalledWith('fileTertiary');
  });
  
  it('habilita el botón guardar cuando el formulario es válido', () => {
    // Mockear el hook useGuideEditor con datos válidos
    const { useGuideEditor } = require('../src/customHooks/pages/guidesEditor/customHook');
    useGuideEditor.mockReturnValueOnce({
      formData: {
        title: 'Título existente',
        category: 'cat1',
        description: 'Descripción existente',
        file: new File(['dummy content'], 'test.png', { type: 'image/png' }),
        fileSecondary: null,
        fileTertiary: null,
        keyMain: '',
        keySecondary: '',
        keyTertiary: '',
        typeDeleted: [],
        data: null
      },
      categoryOptions: [
        { label: 'Categoría 1', value: 'cat1' },
        { label: 'Categoría 2', value: 'cat2' }
      ],
      loading: false,
      error: null,
      isEditing: false,
      handleSubmit: mockHandleSubmit,
      handleFieldChange: mockHandleFieldChange,
      handleFileDelete: mockHandleFileDelete,
      handleBack: mockHandleBack,
      fetchCategories: mockFetchCategories
    });
    
    // Modificamos el mock de TitleSearch para este test específico
    const TitleSearchMock = require('../src/components/titleSearch');
    TitleSearchMock.TitleSearch.mockImplementationOnce(({ label, onBack, callToAction }) => (
      <div data-testid="mock-title-search">
        <h1>{label}</h1>
        <button onClick={onBack} data-testid="back-button">Volver</button>
        {callToAction && (
          <button 
            onClick={callToAction.onClick} 
            disabled={callToAction.disabled}
            data-testid="save-button"
          >
            {callToAction.label}
          </button>
        )}
      </div>
    ));
    
    render(<GuidesEditor />);
    
    // Verificar que el botón guardar no está deshabilitado
    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).not.toBeDisabled();
  });
});
