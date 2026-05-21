def imprimir_pasos(titulo, pasos):
    """Imprime de forma formateada los arreglos de pasos."""
    print(f"\n{'='*40}")
    print(f" {titulo} ")
    print(f"{'='*40}")
    for paso in pasos:
        print(paso)