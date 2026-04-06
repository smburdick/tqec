from tqec.compile.specs.library.generators.utils import PlaquetteMapper
from tqec.plaquette.compilation.base import PlaquetteCompiler
from tqec.plaquette.rpng.translators.base import RPNGTranslator


class UniformScheduleConventionGenerator:
    def __init__(self, translator: RPNGTranslator, compiler: PlaquetteCompiler):
        """Low-level helper class centralising all the plaquette creation for the fixed boundary
        convention.

        This class provides all the methods needed to return the appropriate templates and
        plaquettes needed to implement low-level QEC layers using the fixed boundary convention.

        """
        self._mapper = PlaquetteMapper(translator, compiler)
