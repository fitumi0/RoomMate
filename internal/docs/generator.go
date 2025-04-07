package docs

import (
	"encoding/json"
	"reflect"
	"roommate/internal/api/payload"
	"roommate/internal/models"
	"roommate/internal/types"
)

// TODO: will be updated

type OpenAPI struct {
	OpenAPI    string                         `json:"openapi"`
	Info       InfoObject                     `json:"info"`
	Paths      map[string]map[string]PathItem `json:"paths"`
	Components ComponentsObject               `json:"components"`
}

type InfoObject struct {
	Title   string `json:"title"`
	Version string `json:"version"`
}

type PathItem struct {
	Summary     string                    `json:"summary"`
	Description string                    `json:"description"`
	Responses   map[string]ResponseObject `json:"responses"`
	RequestBody *RequestBodyObject        `json:"requestBody,omitempty"`
}

type RequestBodyObject struct {
	Description string                     `json:"description"`
	Required    bool                       `json:"required"`
	Content     map[string]MediaTypeObject `json:"content"`
}

type ResponseObject struct {
	Description string                     `json:"description"`
	Content     map[string]MediaTypeObject `json:"content"`
}

type MediaTypeObject struct {
	Schema SchemaObject `json:"schema"`
}

type SchemaObject struct {
	Type       string                  `json:"type,omitempty"`
	Properties map[string]SchemaObject `json:"properties,omitempty"`
	Items      *SchemaObject           `json:"items,omitempty"`
	Ref        string                  `json:"$ref,omitempty"`
}

type ComponentsObject struct {
	Schemas map[string]SchemaObject `json:"schemas"`
}

func generateSchemas() map[string]SchemaObject {
	return map[string]SchemaObject{
		"Room": structToSchema(reflect.TypeOf(models.Room{})),
	}
}

// Converts a Go struct to an OpenAPI schema
func structToSchema(t reflect.Type) SchemaObject {
	properties := make(map[string]SchemaObject)

	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		fieldType := field.Type
		schema := SchemaObject{}

		switch fieldType.Kind() {
		case reflect.String:
			schema.Type = "string"
		case reflect.Int, reflect.Int64:
			schema.Type = "integer"
		case reflect.Bool:
			schema.Type = "boolean"
		case reflect.Slice:
			schema.Type = "array"
			schema.Items = &SchemaObject{Type: "string"} // simplify
		case reflect.Struct:
			schema = structToSchema(fieldType)
		}

		properties[field.Name] = schema
	}

	return SchemaObject{
		Type:       "object",
		Properties: properties,
	}
}

// GenerateSwagger generates an OpenAPI 3.0 JSON spec
func GenerateSwagger(routes []types.Route) ([]byte, error) {
	paths := make(map[string]map[string]PathItem)

	for _, route := range routes {
		methods := make(map[string]PathItem)

		for method := range route.Handlers {
			lowerMethod := ""
			switch method {
			case payload.METHOD_GET:
				lowerMethod = "get"
			case payload.METHOD_POST:
				lowerMethod = "post"
			case payload.METHOD_PATCH:
				lowerMethod = "patch"
			case payload.METHOD_PUT:
				lowerMethod = "put"
			case payload.METHOD_DELETE:
				lowerMethod = "delete"
			default:
				continue
			}

			methods[lowerMethod] = PathItem{
				Summary:     "Auto-generated route",
				Description: "Generated from route registration",
				Responses: map[string]ResponseObject{
					"200": {
						Description: "Success",
						Content: map[string]MediaTypeObject{
							"application/json": {
								Schema: SchemaObject{
									Type: "object",
								},
							},
						},
					},
				},
				RequestBody: &RequestBodyObject{
					Description: "Request payload",
					Required:    true,
					Content: map[string]MediaTypeObject{
						"application/json": {
							Schema: SchemaObject{
								Ref: "#/components/schemas/Room",
							},
						},
					},
				},
			}
		}

		paths[route.Path] = methods
	}

	openAPI := OpenAPI{
		OpenAPI: "3.0.0",
		Info: InfoObject{
			Title:   "Roommate API",
			Version: "1.0.0",
		},
		Paths: paths,
		Components: ComponentsObject{
			Schemas: generateSchemas(),
		},
	}

	return json.MarshalIndent(openAPI, "", "  ")
}
