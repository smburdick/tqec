from tqec.compile.specs.base import CubeBuilder
from tqec.compile.specs.library.generators.uniform_schedule import (
    UniformScheduleConventionGenerator,
)
from tqec.plaquette.compilation.base import PlaquetteCompiler
from tqec.plaquette.rpng.translators.base import RPNGTranslator


class UniformScheduleCubeBuilder(CubeBuilder):
    def __init__(self, compiler: PlaquetteCompiler, translator: RPNGTranslator):
        """Implement uniform scheduling."""
        self._generator = UniformScheduleConventionGenerator(translator, compiler)
